import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BillPayment,
  DashboardStats,
  PaymentMethod,
  Transaction,
} from "../backend";
import { useActor } from "./useActor";

export function useTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactionHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePaymentMethods() {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentMethod[]>({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPaymentMethods();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor)
        return { transactionsThisMonth: BigInt(0), totalPaidAmount: 0 };
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePayBill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bill: BillPayment) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.submitBillPayment(bill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useAddPaymentMethod() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cardNumber,
      cardHolderName,
      cardType,
    }: { cardNumber: string; cardHolderName: string; cardType: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addPaymentMethod(cardNumber, cardHolderName, cardType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
}

export function useRemovePaymentMethod() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removePaymentMethod(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
}
