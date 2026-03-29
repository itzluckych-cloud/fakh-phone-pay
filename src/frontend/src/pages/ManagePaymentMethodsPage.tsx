import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddPaymentMethod,
  usePaymentMethods,
  useRemovePaymentMethod,
} from "../hooks/useQueries";

const CARD_TYPES = ["Visa", "Mastercard", "Verve"];
const skeletonKeys = ["sk1", "sk2", "sk3"];

const cardTypeColor: Record<string, string> = {
  Visa: "bg-blue-100 text-blue-700",
  Mastercard: "bg-red-100 text-red-700",
  Verve: "bg-green-100 text-green-700",
};

export default function ManagePaymentMethodsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardType, setCardType] = useState("");
  const [removeTarget, setRemoveTarget] = useState<bigint | null>(null);

  const { data: methods = [], isLoading } = usePaymentMethods();
  const addMethod = useAddPaymentMethod();
  const removeMethod = useRemovePaymentMethod();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolderName || !cardType) {
      toast.error("Please fill in all card details");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 12) {
      toast.error("Please enter a valid card number");
      return;
    }
    try {
      await addMethod.mutateAsync({ cardNumber, cardHolderName, cardType });
      setShowAdd(false);
      setCardNumber("");
      setCardHolderName("");
      setCardType("");
      toast.success("Payment method added!");
    } catch {
      toast.error("Failed to add payment method");
    }
  };

  const handleRemove = async () => {
    if (removeTarget === null) return;
    try {
      await removeMethod.mutateAsync(removeTarget);
      setRemoveTarget(null);
      toast.success("Payment method removed");
    } catch {
      toast.error("Failed to remove payment method");
    }
  };

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary">
                Payment Methods
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your saved cards for quick payments.
              </p>
            </div>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => setShowAdd(true)}
              data-ocid="methods.add.open_modal_button"
            >
              <PlusCircle className="mr-2 w-4 h-4" /> Add Card
            </Button>
          </div>

          {isLoading ? (
            <div
              className="flex flex-col gap-4"
              data-ocid="methods.loading_state"
            >
              {skeletonKeys.map((k) => (
                <Skeleton key={k} className="h-20 w-full" />
              ))}
            </div>
          ) : methods.length === 0 ? (
            <Card
              className="border-dashed border-2 border-border"
              data-ocid="methods.empty_state"
            >
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-secondary mb-1">
                  No Payment Methods
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Add a debit or credit card to start making payments.
                </p>
                <Button
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => setShowAdd(true)}
                  data-ocid="methods.add_first.button"
                >
                  <PlusCircle className="mr-2 w-4 h-4" /> Add Your First Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {methods.map((method, i) => (
                  <motion.div
                    key={method.id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    data-ocid={`methods.item.${i + 1}`}
                  >
                    <Card className="shadow-card border-border">
                      <CardContent className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${cardTypeColor[method.cardType] ?? "bg-muted text-muted-foreground"}`}
                              >
                                {method.cardType}
                              </span>
                              <span className="font-semibold text-secondary">
                                •••• •••• •••• {method.cardNumber.slice(-4)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {method.cardHolderName}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setRemoveTarget(method.id)}
                          data-ocid={`methods.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Method Modal */}
      <Dialog
        open={showAdd}
        onOpenChange={(open) => !open && setShowAdd(false)}
      >
        <DialogContent className="sm:max-w-md" data-ocid="methods.add.dialog">
          <DialogHeader>
            <DialogTitle className="text-secondary">
              Add Payment Method
            </DialogTitle>
            <DialogDescription>
              Enter your card details to save a new payment method.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                data-ocid="methods.card_number.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                placeholder="John Doe"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                data-ocid="methods.cardholder.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Card Type</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger data-ocid="methods.card_type.select">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  {CARD_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {addMethod.isError && (
              <p
                className="text-sm text-destructive"
                data-ocid="methods.add.error_state"
              >
                Failed to add card. Please try again.
              </p>
            )}
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdd(false)}
                data-ocid="methods.add.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90"
                disabled={addMethod.isPending}
                data-ocid="methods.add.submit_button"
              >
                {addMethod.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Card"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove Confirm Dialog */}
      <Dialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <DialogContent
          className="sm:max-w-sm"
          data-ocid="methods.remove.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-secondary">Remove Card?</DialogTitle>
            <DialogDescription>
              This payment method will be permanently removed from your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setRemoveTarget(null)}
              data-ocid="methods.remove.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleRemove}
              disabled={removeMethod.isPending}
              data-ocid="methods.remove.confirm_button"
            >
              {removeMethod.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
