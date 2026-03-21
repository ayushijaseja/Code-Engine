import Dashboard from '@/features/dashboard/components/Dashboard';
import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return <Dashboard />;
}