import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_PRODUCTS, INITIAL_TICKETS } from '../services/catalog';
import type { PaymentMethod, Product, SaleCartItem, TicketSummary } from '../types/fruteria';

type FruteriaContextValue = {
  products: Product[];
  tickets: TicketSummary[];
  registerSale: (items: SaleCartItem[], paymentMethod: PaymentMethod) => void;
};

const STORAGE_KEYS = {
  products: 'fruteria.products.v1',
  tickets: 'fruteria.tickets.v1',
} as const;

const FruteriaContext = createContext<FruteriaContextValue | null>(null);

function readStoredState<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function paymentLabel(paymentMethod: PaymentMethod) {
  if (paymentMethod === 'efectivo') return 'Efectivo';
  if (paymentMethod === 'tarjeta') return 'Tarjeta';
  return 'Transferencia';
}

export function FruteriaProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => readStoredState(STORAGE_KEYS.products, INITIAL_PRODUCTS));
  const [tickets, setTickets] = useState<TicketSummary[]>(() => readStoredState(STORAGE_KEYS.tickets, INITIAL_TICKETS));

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
  }, [tickets]);

  const registerSale = (items: SaleCartItem[], paymentMethod: PaymentMethod) => {
    if (items.length === 0) {
      return;
    }

    const saleTotal = items.reduce((accumulator, item) => {
      const product = products.find(current => current.id === item.id);
      return accumulator + (product?.price ?? 0) * item.quantity;
    }, 0);

    const saleItems = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

    setProducts(currentProducts =>
      currentProducts.map(product => {
        const cartItem = items.find(item => item.id === product.id);
        if (!cartItem) {
          return product;
        }

        return {
          ...product,
          stock: Math.max(0, product.stock - cartItem.quantity),
        };
      })
    );

    setTickets(currentTickets => {
      const nextTicketNumber = currentTickets.length > 0
        ? Number(currentTickets[0].id.replace('#', '')) + 1
        : 4522;

      return [
        {
          id: `#${nextTicketNumber}`,
          ago: 'Hace unos momentos',
          items: saleItems,
          total: saleTotal,
          method: paymentLabel(paymentMethod),
        },
        ...currentTickets,
      ];
    });
  };

  const value = useMemo(
    () => ({ products, tickets, registerSale }),
    [products, tickets]
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
