import type { Metadata } from 'next';
import CustomerDashboard from '@/components/CustomerDashboard';

export const metadata: Metadata = { title: 'Customer portal' };

export default function DashboardPage() {
  return <CustomerDashboard />;
}
