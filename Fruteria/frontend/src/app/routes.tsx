import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { Employee } from "./pages/Employee";
import { Sales } from "./pages/Sales";
import { Settings } from "./pages/Settings";
import { Inventory } from "./pages/Inventory";
import { ProductRegister } from "./pages/ProductRegister";
import { ProductRemove } from "./pages/ProductRemove";
import { QuantityRegister } from "./pages/QuantityRegister";
import { DateControl } from "./pages/DateControl";
import { WeightRegister } from "./pages/WeightRegister";
import { CashCut } from "./pages/CashCut";
import { CashDrawer } from "./pages/CashDrawer";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "admin",
        Component: Admin,
      },
      {
        path: "employee",
        Component: Employee,
      },
      {
        path: "sales",
        Component: Sales,
      },
      {
        path: "settings",
        Component: Settings,
      },
      {
        path: "inventory",
        Component: Inventory,
      },
      {
        path: "register",
        Component: ProductRegister,
      },
      {
        path: "remove",
        Component: ProductRemove,
      },
      {
        path: "quantity-register",
        Component: QuantityRegister,
      },
      {
        path: "date-control",
        Component: DateControl,
      },
      {
        path: "weight-register",
        Component: WeightRegister,
      },
      {
        path: "cash-cut",
        Component: CashCut,
      },
      {
        path: "cash-drawer",
        Component: CashDrawer,
      },
    ],
  },
]);
