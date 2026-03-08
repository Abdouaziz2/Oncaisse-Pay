export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  latePayments: number;
  totalRevenue: number;
  expectedRevenue: number;
  pendingRevenue: number;
  collectionRate: number;
  paymentsByMethod: { [key: string]: number };
  paymentsByMonth: { [key: string]: number };
  revenueByMonth: { [key: string]: number };
}
