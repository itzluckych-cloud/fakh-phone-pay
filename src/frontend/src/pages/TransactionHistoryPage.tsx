import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Calendar, Receipt, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { TransactionStatus } from "../backend";
import { useDashboardStats, useTransactions } from "../hooks/useQueries";

function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === TransactionStatus.paid) {
    return (
      <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20">
        ✓ Paid
      </Badge>
    );
  }
  if (status === TransactionStatus.pending) {
    return (
      <Badge className="bg-warning/15 text-warning border-warning/20 hover:bg-warning/20">
        ⏳ Pending
      </Badge>
    );
  }
  return (
    <Badge className="bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20">
      ✗ Failed
    </Badge>
  );
}

function formatDate(ns: bigint) {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const skeletonRows = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export default function TransactionHistoryPage() {
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary">
              Transaction History
            </h1>
            <p className="text-muted-foreground mt-1">
              All your bill payments in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card className="shadow-card border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  {statsLoading ? (
                    <Skeleton
                      className="h-7 w-28 mt-1"
                      data-ocid="stats.total.loading_state"
                    />
                  ) : (
                    <p
                      className="text-2xl font-bold text-secondary"
                      data-ocid="stats.total.card"
                    >
                      ₦{(stats?.totalPaidAmount ?? 0).toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  {statsLoading ? (
                    <Skeleton
                      className="h-7 w-16 mt-1"
                      data-ocid="stats.month.loading_state"
                    />
                  ) : (
                    <p
                      className="text-2xl font-bold text-secondary"
                      data-ocid="stats.month.card"
                    >
                      {stats?.transactionsThisMonth?.toString() ?? "0"} txns
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="shadow-card border-border overflow-hidden">
            {txLoading ? (
              <div
                className="p-6 flex flex-col gap-3"
                data-ocid="transactions.loading_state"
              >
                {skeletonRows.map((k) => (
                  <Skeleton key={k} className="h-10 w-full" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="transactions.empty_state"
              >
                <Receipt className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-secondary mb-1">
                  No Transactions Yet
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your bill payments will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto" data-ocid="transactions.table">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Date</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx, i) => (
                      <TableRow
                        key={tx.id.toString()}
                        className="hover:bg-muted/30"
                        data-ocid={`transactions.item.${i + 1}`}
                      >
                        <TableCell className="text-muted-foreground">
                          {formatDate(tx.date)}
                        </TableCell>
                        <TableCell className="font-medium text-secondary">
                          {tx.phoneNumber}
                        </TableCell>
                        <TableCell>{tx.provider}</TableCell>
                        <TableCell className="font-semibold text-secondary">
                          ₦{tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={tx.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>

          {!txLoading && transactions.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              Showing {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
