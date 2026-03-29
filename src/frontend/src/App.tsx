import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import LandingPage from "./pages/LandingPage";
import ManagePaymentMethodsPage from "./pages/ManagePaymentMethodsPage";
import PayBillsPage from "./pages/PayBillsPage";
import SoundBoxPage from "./pages/SoundBoxPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";

export type Page = "landing" | "pay" | "transactions" | "methods" | "soundbox";

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const navigate = (p: Page) => {
    if (
      (p === "pay" ||
        p === "transactions" ||
        p === "methods" ||
        p === "soundbox") &&
      !isAuthenticated
    ) {
      return;
    }
    setPage(p);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={page} navigate={navigate} />
      <main className="flex-1">
        {page === "landing" && <LandingPage navigate={navigate} />}
        {page === "pay" && isAuthenticated && <PayBillsPage />}
        {page === "transactions" && isAuthenticated && (
          <TransactionHistoryPage />
        )}
        {page === "methods" && isAuthenticated && <ManagePaymentMethodsPage />}
        {page === "soundbox" && isAuthenticated && <SoundBoxPage />}
        {page !== "landing" && !isAuthenticated && (
          <LandingPage navigate={navigate} />
        )}
      </main>
      <Footer navigate={navigate} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
