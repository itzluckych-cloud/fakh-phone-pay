import { Smartphone } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import type { Page } from "../App";

interface FooterProps {
  navigate: (page: Page) => void;
}

const socialLinks = [
  { Icon: SiFacebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: SiX, href: "https://x.com", label: "X" },
  { Icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: SiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const supportLinks = [
  "Help Center",
  "Contact Us",
  "Privacy Policy",
  "Terms of Service",
];

export default function Footer({ navigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Fakh Phone Pay</span>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Fast, secure phone bill payments for everyone. Pay MTN, Airtel,
              Glo, 9mobile and more.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Pay Bills", page: "pay" as Page },
                { label: "Transaction History", page: "transactions" as Page },
                { label: "Manage Methods", page: "methods" as Page },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    type="button"
                    onClick={() => navigate(link.page)}
                    className="text-sm text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Providers */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Supported Networks
            </h4>
            <ul className="space-y-2">
              {[
                "MTN Nigeria",
                "Airtel Nigeria",
                "Glo Mobile",
                "9mobile",
                "Other Networks",
              ].map((net) => (
                <li key={net}>
                  <span className="text-sm text-white/70">{net}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item}>
                  <a
                    href="https://caffeine.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            &copy; {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-sm text-white/60">
            Secure payments powered by blockchain technology
          </p>
        </div>
      </div>
    </footer>
  );
}
