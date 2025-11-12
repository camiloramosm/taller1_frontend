import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Cart } from './components/Cart';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminMessagesPage } from './pages/AdminMessagesPage';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmacion/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
          <Route path="/admin/mensajes" element={<AdminMessagesPage />} />
        </Routes>

        <Cart />

      <footer className="bg-black text-white py-8 text-center">
        <p className="text-gray-400">
          © 2024 El Campo de Don Ramón. Compartiendo la vida del campo con
          autenticidad.
        </p>
      </footer>

        {/* Toast Notifications */}
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}