import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { fetchUserRoles } from "./store/authSlice";
// fire a roles fetch on app start if token exists
store.dispatch(fetchUserRoles());
import AuthorizedRoute from "./routes/AuthorizedRoute";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "antd/dist/reset.css";
import "./index.css";

import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/Login";
import Modules from "./pages/modules/Modules";
import Ordering from "./pages/ordering/Ordering";
import Configuration from "./pages/configuration/Configuration";
import Users from "./pages/configuration/Users";
import Monitors from "./pages/monitors/Monitors";
import Reports from "./pages/reports/Reports";
import Reservations from "./pages/reservations/Reservations";
import Inventory from "./pages/inventory/Inventory";
import Dashboard from "./pages/configuration/Dashboard";
import Discounts from "./pages/discounts/Discounts";
import Delivery from "./pages/delivery/Delivery";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Modules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ordering"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={13}>
                    <Ordering />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuration"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={19}>
                    <Configuration />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            >
              {/* index shows the basic configuration landing */}
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
            </Route>
            <Route
              path="/monitors"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={22}>
                    <Monitors />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={26}>
                    <Reports />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={31}>
                    <Reservations />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={34}>
                    <Inventory />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/discounts"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={40}>
                    <Discounts />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute>
                  <AuthorizedRoute requiredParentId={37}>
                    <Delivery />
                  </AuthorizedRoute>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
