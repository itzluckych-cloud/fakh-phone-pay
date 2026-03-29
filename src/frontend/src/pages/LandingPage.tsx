import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Download,
  History,
  Shield,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import AuthModal from "../components/AuthModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const sampleTransactions = [
  {
    date: "Mar 27, 2026",
    service: "MTN Nigeria",
    amount: "₦5,000",
    status: "Paid",
  },
  {
    date: "Mar 25, 2026",
    service: "Airtel Nigeria",
    amount: "₦3,500",
    status: "Paid",
  },
  {
    date: "Mar 22, 2026",
    service: "Glo Mobile",
    amount: "₦2,000",
    status: "Paid",
  },
  {
    date: "Mar 20, 2026",
    service: "9mobile",
    amount: "₦1,500",
    status: "Paid",
  },
  {
    date: "Mar 18, 2026",
    service: "MTN Nigeria",
    amount: "₦10,000",
    status: "Paid",
  },
];

const featureCards = [
  {
    icon: Zap,
    title: "Quick Pay",
    description:
      "Pay your phone bills in seconds. No queues, no delays. Just enter your number and pay instantly.",
    badge: "Instant",
  },
  {
    icon: History,
    title: "Transaction History",
    description:
      "Keep track of every payment you've made. Filter by date, provider, or amount with ease.",
    badge: "Organized",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Your payments are protected by blockchain technology and Internet Identity authentication.",
    badge: "Safe",
  },
];

const steps = [
  {
    icon: CreditCard,
    step: "Step 1",
    title: "Add Payment Method",
    desc: "Link your debit or credit card to your Fakh account securely.",
  },
  {
    icon: Smartphone,
    step: "Step 2",
    title: "Enter Phone Number",
    desc: "Type in the phone number you want to recharge or pay bills for.",
  },
  {
    icon: CheckCircle,
    step: "Step 3",
    title: "Select Provider & Amount",
    desc: "Choose your mobile network and the exact amount you need.",
  },
  {
    icon: Zap,
    step: "Step 4",
    title: "Confirm & Pay",
    desc: "Review the details and confirm. Payment is instant and secure.",
  },
];

interface LandingPageProps {
  navigate: (page: Page) => void;
}

export default function LandingPage({ navigate }: LandingPageProps) {
  const { identity } = useInternetIdentity();
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const isAuthenticated = !!identity;

  const handlePayNow = () => {
    if (isAuthenticated) navigate("pay");
    else setAuthMode("signup");
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-hero-gradient text-white py-20 md:py-28">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🇳🇬 Nigeria's Fastest Phone Payment
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
                Pay Phone Bills{" "}
                <span className="text-yellow-300">Instantly</span> & Securely
              </h1>
              <p className="text-lg md:text-xl text-white/85 mb-8 max-w-lg">
                Recharge MTN, Airtel, Glo, and 9mobile in seconds. Track every
                transaction. Manage your payment methods — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90 font-semibold shadow-lg"
                  onClick={handlePayNow}
                  data-ocid="hero.primary_button"
                >
                  Pay Your Bill Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold"
                  data-ocid="hero.secondary_button"
                >
                  <Download className="mr-2 w-4 h-4" /> Download the App
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/70" />
                  <span className="text-sm text-white/80">
                    50,000+ happy users
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white/70" />
                  <span className="text-sm text-white/80">99.9% uptime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-2xl transform scale-110" />
                <img
                  src="/assets/uploads/design-preview.png"
                  alt="Fakh Phone Pay App"
                  className="relative w-72 rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete solution for all your phone bill payment needs
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                data-ocid={`features.card.${i + 1}`}
              >
                <Card className="h-full border-border shadow-card hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <card.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                      {card.badge}
                    </Badge>
                    <h3 className="font-semibold text-secondary text-lg mb-2">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {card.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 text-primary border-primary/30 hover:bg-primary/5"
                      onClick={handlePayNow}
                    >
                      Learn More <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Pay your bills in four simple steps
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
                data-ocid={`steps.card.${i + 1}`}
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-primary/20 flex items-center justify-center shadow-sm">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                  {step.step}
                </span>
                <h3 className="font-semibold text-secondary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transactions Preview */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Track Every Payment
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                A clear, detailed history of all your bill payments. Know
                exactly where your money went and when.
              </p>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={handlePayNow}
                data-ocid="transactions_preview.primary_button"
              >
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-card border-border overflow-hidden">
                <div className="bg-muted px-4 py-3 border-b border-border">
                  <h4 className="font-semibold text-secondary text-sm">
                    Recent Transactions
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table
                    className="w-full text-sm"
                    data-ocid="transactions_preview.table"
                  >
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                          Service
                        </th>
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                          Amount
                        </th>
                        <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleTransactions.map((tx, i) => (
                        <tr
                          key={tx.service + tx.date}
                          className="border-t border-border hover:bg-muted/30 transition-colors"
                          data-ocid={`transactions_preview.item.${i + 1}`}
                        >
                          <td className="px-4 py-3 text-muted-foreground">
                            {tx.date}
                          </td>
                          <td className="px-4 py-3 font-medium text-secondary">
                            {tx.service}
                          </td>
                          <td className="px-4 py-3 font-semibold text-secondary">
                            {tx.amount}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                              ✓ {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-hero-gradient">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of Nigerians paying bills faster with Fakh Phone
              Pay.
            </p>
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/90 font-semibold"
              onClick={handlePayNow}
              data-ocid="cta.primary_button"
            >
              Start Paying Bills <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
    </div>
  );
}
