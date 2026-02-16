import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Categories from "../pages/Categories";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Suppliers from "../pages/Suppliers";
import PurchaseOrders from "../pages/purchase-orders/PurchaseOrders";
import CreatePurchaseOrder from "../pages/purchase-orders/CreatePurchaseOrder";
import EditPurchaseOrder from "../pages/purchase-orders/EditPurchaseOrder";
import Customers from "../pages/Customers";
import SalesOrders from "../pages/sales-orders/SalesOrders";
import CreateSalesOrder from "../pages/sales-orders/CreateSalesOrder";
import EditSalesOrder from "../pages/sales-orders/EditSalesOrder";
import Dashboard from "../pages/Dashboard";
import AuditLogs from "../pages/AuditLogs";
import Users from "../pages/Users";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="users" element={<Users />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />

            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route
              path="purchase-orders/create"
              element={<CreatePurchaseOrder />}
            />
            <Route
              path="purchase-orders/:id/edit"
              element={<EditPurchaseOrder />}
            />

            <Route path="sales-orders" element={<SalesOrders />} />
            <Route path="sales-orders/create" element={<CreateSalesOrder />} />
            <Route path="sales-orders/:id/edit" element={<EditSalesOrder />} />

            <Route path="audit-logs" element={<AuditLogs />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
