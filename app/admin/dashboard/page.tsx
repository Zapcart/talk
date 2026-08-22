import type { Metadata } from 'next';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata: Metadata = { title: 'Admin control center' };

export default function LegacyAdminDashboardPage() {
  return <AdminDashboard />;
}
