import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type TransactionId = bigint;
export type PaymentId = bigint;
export interface PaymentMethod {
    id: PaymentId;
    owner: Principal;
    cardType: string;
    cardHolderName: string;
    cardNumber: string;
}
export interface BillPayment {
    paymentMethodId: PaymentId;
    provider: string;
    phoneNumber: string;
    amount: number;
}
export interface DashboardStats {
    transactionsThisMonth: bigint;
    totalPaidAmount: number;
}
export interface UserProfile {
    name: string;
}
export interface Transaction {
    id: TransactionId;
    status: TransactionStatus;
    provider: string;
    date: bigint;
    phoneNumber: string;
    amount: number;
}
export enum TransactionStatus {
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPaymentMethod(cardNumber: string, cardHolderName: string, cardType: string): Promise<PaymentId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getTransactionHistory(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listPaymentMethods(): Promise<Array<PaymentMethod>>;
    removePaymentMethod(id: PaymentId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBillPayment(billPayment: BillPayment): Promise<TransactionId>;
}
