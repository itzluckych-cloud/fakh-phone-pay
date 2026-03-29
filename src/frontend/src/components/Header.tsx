import { Button } from "@/components/ui/button";
import { Menu, Smartphone, Volume2, X } from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AuthModal from "./AuthModal";

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export default function Header({ currentPage, navigate }: HeaderProps) {
  const { identity, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);

  const navLinks: {
    label: string;
    page: Page;
    icon?: React.ReactNode;
    authRequired?: boolean;
  }[] = [
    { label: "Pay Bills", page: "pay" },
    { label: "Transaction History", page: "transactions" },
    { label: "Manage Methods", page: "methods" },
    {
      label: "Sound Box",
      page: "soundbox",
      icon: <Volume2 className="w-3.5 h-3.5" />,
      authRequired: true,
    },
  ];

  const visibleLinks = navLinks.filter(
    (l) => !l.authRequired || isAuthenticated,
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <button
              type="button"
              onClick={() => navigate("landing")}
              className="flex items-center gap-2 font-bold text-lg text-secondary"
              data-ocid="header.link"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span>Fakh Phone Pay</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {visibleLinks.map((link) => (
                <button
                  type="button"
                  key={link.page}
                  onClick={() => navigate(link.page)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    currentPage === link.page
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  data-ocid={`nav.${link.page}.link`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="header.signout.button"
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthMode("signin")}
                    disabled={isLoggingIn}
                    data-ocid="header.signin.button"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-white hover:bg-accent/90"
                    onClick={() => setAuthMode("signup")}
                    data-ocid="header.create_account.button"
                  >
                    Create Account
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="header.menu.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border py-4 flex flex-col gap-3">
              {visibleLinks.map((link) => (
                <button
                  type="button"
                  key={link.page}
                  onClick={() => {
                    navigate(link.page);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium text-left px-2 py-1 text-muted-foreground hover:text-primary"
                  data-ocid={`mobile.nav.${link.page}.link`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="w-full mt-2"
                >
                  Sign Out
                </Button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setAuthMode("signin");
                      setMobileOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent text-white hover:bg-accent/90"
                    onClick={() => {
                      setAuthMode("signup");
                      setMobileOpen(false);
                    }}
                  >
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
    </>
  );
}
