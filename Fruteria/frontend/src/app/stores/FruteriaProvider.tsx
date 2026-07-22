import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_PRODUCTS, INITIAL_TICKETS } from '../services/catalog';
import { readJsonStorage, writeJsonStorage } from '../utils/storage';
import type { PaymentMethod, Product, SaleCartItem, TicketSummary } from '../types/fruteria';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { toast } from 'sonner';

type FruteriaContextValue = {
  products: Product[];
  tickets: TicketSummary[];
  isSyncing: boolean;
  registerSale: (items: SaleCartItem[], paymentMethod: PaymentMethod) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  updateProductPrice: (id: number, price: number) => void;
  updateProductStock: (id: number, stock: number) => void;
  updateProductDates: (id: number, entryDate: string, expiryDate: string) => void;
};

const STORAGE_KEYS = {
  products: 'fruteria.products.v1',
  tickets: 'fruteria.tickets.v1',
} as const;

const FruteriaContext = createContext<FruteriaContextValue | null>(null);

function paymentLabel(paymentMethod: PaymentMethod) {
  if (paymentMethod === 'efectivo') return 'Efectivo';
  if (paymentMethod === 'tarjeta') return 'Tarjeta';
  return 'Transferencia';
}

/** Surfaces a Supabase/Postgrest error consistently in the console and as a toast. */
function reportSyncError(action: string, error: unknown) {
  console.error(`[Supabase] ${action} failed:`, error);
  const message = error instanceof Error ? error.message : 'Error desconocido';
  toast.error(`No se pudo sincronizar con la base de datos (${action}). ${message}`);
}

export function FruteriaProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    readJsonStorage(STORAGE_KEYS.products, INITIAL_PRODUCTS)
  );
  const [tickets, setTickets] = useState<TicketSummary[]>(() =>
    readJsonStorage(STORAGE_KEYS.tickets, INITIAL_TICKETS)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Local storage stays as an offline-friendly mirror of the last known
  // state (either from Supabase, or from a previous local session if
  // Supabase is unreachable). It is never the source of truth once Supabase
  // is configured and reachable.
  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.tickets, tickets);
  }, [tickets]);

  // Load initial data from Supabase on mount. Supabase is the source of
  // truth whenever it can be reached: a successful (even empty) response
  // replaces local/mock data. We only fall back to whatever was already in
  // local storage or the bundled demo data when Supabase itself can't be
  // reached (missing config, network error, or a Postgrest error), so an
  // intentionally emptied table doesn't get "resurrected" by stale mock data.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let cancelled = false;

    async function loadFromSupabase() {
      setIsSyncing(true);
      try {
        const { data: dbProducts, error: pError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (pError) throw pError;
        if (!cancelled && dbProducts) {
          setProducts(dbProducts as Product[]);
        }
      } catch (err) {
        reportSyncError('carga de productos', err);
      }

      try {
        const { data: dbTickets, error: tError } = await supabase
          .from('tickets')
          .select('*')
          .order('ticket_id', { ascending: false });

        if (tError) throw tError;
        if (!cancelled && dbTickets) {
          // Map Supabase column 'ticket_id' to local 'id'
          const mapped = (dbTickets as Array<Record<string, unknown>>).map(t => ({
            id: t.ticket_id as string,
            ago: t.ago as string,
            items: t.items as number,
            total: t.total as number,
            method: t.method as string,
          }));
          setTickets(mapped);
        }
      } catch (err) {
        reportSyncError('carga de tickets', err);
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    }

    loadFromSupabase();

    return () => {
      cancelled = true;
    };
  }, []);

  const registerSale = async (items: SaleCartItem[], paymentMethod: PaymentMethod) => {
    if (items.length === 0) {
      return;
    }

    // Snapshot so we can roll back precisely if the database write fails.
    const previousProducts = products;
    const previousTickets = tickets;

    const saleTotal = items.reduce((accumulator, item) => {
      const product = products.find(current => current.id === item.id);
      return accumulator + (product?.price ?? 0) * item.quantity;
    }, 0);

    const saleItems = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

    const updatedProducts = products.map(product => {
      const cartItem = items.find(item => item.id === product.id);
      if (!cartItem) {
        return product;
      }
      return {
        ...product,
        stock: Math.max(0, product.stock - cartItem.quantity),
      };
    });

    const nextTicketNumber = tickets.length > 0
      ? Number(tickets[0].id.replace('#', '')) + 1
      : 4522;

    const newTicket: TicketSummary = {
      id: `#${nextTicketNumber}`,
      ago: 'Hace unos momentos',
      items: saleItems,
      total: saleTotal,
      method: paymentLabel(paymentMethod),
    };

    // Optimistic update: the cashier sees the sale reflected instantly.
    setProducts(updatedProducts);
    setTickets(currentTickets => [newTicket, ...currentTickets]);

    if (!isSupabaseConfigured) {
      return;
    }

    try {
      // Persist the stock decrement for every affected product. Any one of
      // these failing throws and triggers a full rollback below, so we never
      // end up with the sale reflected on screen but only partially saved.
      const stockUpdates = items.map(item => {
        const prod = updatedProducts.find(p => p.id === item.id);
        if (!prod) return Promise.resolve();
        return supabase
          .from('products')
          .update({ stock: prod.stock })
          .eq('id', prod.id)
          .then(({ error }) => {
            if (error) throw error;
          });
      });

      await Promise.all(stockUpdates);

      // Map local 'id' to Supabase column 'ticket_id'
      const dbTicket = {
        ticket_id: newTicket.id,
        ago: newTicket.ago,
        items: newTicket.items,
        total: newTicket.total,
        method: newTicket.method,
      };
      const { error: ticketError } = await supabase.from('tickets').insert([dbTicket]);
      if (ticketError) throw ticketError;
    } catch (err) {
      reportSyncError('registro de venta', err);
      // Roll back so the on-screen state matches what's actually in the database.
      setProducts(previousProducts);
      setTickets(previousTickets);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const nextId = products.reduce((maxId, p) => Math.max(maxId, p.id), 0) + 1;
    const newProduct: Product = {
      ...product,
      id: nextId,
    };

    setProducts(currentProducts => [...currentProducts, newProduct]);

    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
    } catch (err) {
      reportSyncError('alta de producto', err);
      setProducts(currentProducts => currentProducts.filter(p => p.id !== newProduct.id));
    }
  };

  const deleteProduct = async (id: number) => {
    const removedProduct = products.find(p => p.id === id);

    setProducts(currentProducts => currentProducts.filter(p => p.id !== id));

    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      reportSyncError('baja de producto', err);
      if (removedProduct) {
        setProducts(currentProducts =>
          currentProducts.some(p => p.id === id) ? currentProducts : [...currentProducts, removedProduct]
        );
      }
    }
  };

  const updateProductPrice = async (id: number, price: number) => {
    const previousPrice = products.find(p => p.id === id)?.price;

    setProducts(currentProducts =>
      currentProducts.map(p => (p.id === id ? { ...p, price } : p))
    );

    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { error } = await supabase.from('products').update({ price }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      reportSyncError('actualización de precio', err);
      if (previousPrice !== undefined) {
        setProducts(currentProducts =>
          currentProducts.map(p => (p.id === id ? { ...p, price: previousPrice } : p))
        );
      }
    }
  };

  const updateProductStock = async (id: number, stock: number) => {
    const previousStock = products.find(p => p.id === id)?.stock;

    setProducts(currentProducts =>
      currentProducts.map(p => (p.id === id ? { ...p, stock } : p))
    );

    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { error } = await supabase.from('products').update({ stock }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      reportSyncError('actualización de existencias', err);
      if (previousStock !== undefined) {
        setProducts(currentProducts =>
          currentProducts.map(p => (p.id === id ? { ...p, stock: previousStock } : p))
        );
      }
    }
  };

  const updateProductDates = async (id: number, entryDate: string, expiryDate: string) => {
    const previous = products.find(p => p.id === id);

    setProducts(currentProducts =>
      currentProducts.map(p => (p.id === id ? { ...p, entryDate, expiryDate } : p))
    );

    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { error } = await supabase.from('products').update({ entryDate, expiryDate }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      reportSyncError('actualización de fechas', err);
      if (previous) {
        setProducts(currentProducts =>
          currentProducts.map(p =>
            p.id === id ? { ...p, entryDate: previous.entryDate, expiryDate: previous.expiryDate } : p
          )
        );
      }
    }
  };

  const value = useMemo(
    () => ({
      products,
      tickets,
      isSyncing,
      registerSale,
      addProduct,
      deleteProduct,
      updateProductPrice,
      updateProductStock,
      updateProductDates,
    }),
    [products, tickets, isSyncing]
  );

  return <FruteriaContext.Provider value={value}>{children}</FruteriaContext.Provider>;
}

export function useFruteria() {
  const context = useContext(FruteriaContext);

  if (!context) {
    throw new Error('useFruteria must be used within a FruteriaProvider');
  }

  return context;
}
