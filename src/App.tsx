import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Cart } from './components/Cart';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmacionPage } from './pages/ConfirmacionPage';
import { DiagnosticoPage } from './pages/DiagnosticoPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminMessagesPage } from './pages/AdminMessagesPage';

function AppContent() {
  const { t } = useLanguage();

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmacion/:pedidoId" element={<ConfirmacionPage />} />
          <Route path="/diagnostico" element={<DiagnosticoPage />} />
          <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
          <Route path="/admin/mensajes" element={<AdminMessagesPage />} />
        </Routes>

        <Cart />

        <footer className="bg-black text-white py-8 text-center">
          <p className="text-gray-400">
            {t.footer.rights}
          </p>
        </footer>

        {/* Toast Notifications */}
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}