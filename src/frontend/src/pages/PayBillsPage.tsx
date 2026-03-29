import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, CreditCard, Loader2, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { usePayBill, usePaymentMethods } from "../hooks/useQueries";

const PROVIDERS = ["MTN", "Airtel", "Glo", "9mobile", "Other"];

export default function PayBillsPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: methods = [], isLoading: methodsLoading } = usePaymentMethods();
  const payBill = usePayBill();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !provider || !amount || !paymentMethodId) {
      toast.error("Please fill in all fields");
      return;
    }
    const numAmount = Number.parseFloat(amount);
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      await payBill.mutateAsync({
        phoneNumber,
        provider,
        amount: numAmount,
        paymentMethodId: BigInt(paymentMethodId),
      });
      setSuccess(true);
      toast.success("Bill payment successful!");
    } catch {
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleReset = () => {
    setPhoneNumber("");
    setProvider("");
    setAmount("");
    setPaymentMethodId("");
    setSuccess(false);
  };

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary">
              Pay Phone Bill
            </h1>
            <p className="text-muted-foreground mt-1">
              Recharge or pay bills for any Nigerian network instantly.
            </p>
          </div>

          {success ? (
            <Card
              className="border-success/30 bg-success/5 shadow-card"
              data-ocid="pay.success_state"
            >
              <CardContent className="flex flex-col items-center py-12">
                <CheckCircle2 className="w-16 h-16 text-success mb-4" />
                <h2 className="text-xl font-bold text-secondary mb-2">
                  Payment Successful!
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Your bill payment of ₦
                  {Number.parseFloat(amount).toLocaleString()} to {provider} (
                  {phoneNumber}) has been processed.
                </p>
                <Button
                  onClick={handleReset}
                  className="bg-primary text-white hover:bg-primary/90"
                  data-ocid="pay.new_payment.button"
                >
                  Make Another Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Bill Payment Details
                </CardTitle>
                <CardDescription>
                  Enter the details for your phone bill payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="e.g. 08012345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      data-ocid="pay.phone.input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Network Provider</Label>
                    <Select value={provider} onValueChange={setProvider}>
                      <SelectTrigger data-ocid="pay.provider.select">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 5000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      data-ocid="pay.amount.input"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Payment Method</Label>
                    {methodsLoading ? (
                      <div
                        className="flex items-center gap-2 text-muted-foreground"
                        data-ocid="pay.methods.loading_state"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">
                          Loading payment methods...
                        </span>
                      </div>
                    ) : methods.length === 0 ? (
                      <div
                        className="text-sm text-muted-foreground bg-muted rounded-lg p-3"
                        data-ocid="pay.methods.empty_state"
                      >
                        <CreditCard className="w-4 h-4 inline mr-1" />
                        No payment methods saved. Add one in{" "}
                        <span className="text-primary font-medium">
                          Manage Methods
                        </span>
                        .
                      </div>
                    ) : (
                      <Select
                        value={paymentMethodId}
                        onValueChange={setPaymentMethodId}
                      >
                        <SelectTrigger data-ocid="pay.method.select">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {methods.map((m) => (
                            <SelectItem
                              key={m.id.toString()}
                              value={m.id.toString()}
                            >
                              {m.cardType} •••• {m.cardNumber.slice(-4)} —{" "}
                              {m.cardHolderName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {payBill.isError && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="pay.error_state"
                    >
                      Payment failed. Please try again.
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-accent text-white hover:bg-accent/90 font-semibold mt-2"
                    disabled={payBill.isPending || methods.length === 0}
                    data-ocid="pay.submit_button"
                  >
                    {payBill.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
