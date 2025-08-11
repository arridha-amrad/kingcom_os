import { me } from '@/hooks/auth/useGetAuth';
import {
  getMyTransactions,
  queryKey,
} from '@/hooks/transactions/useGetTransactions';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/transactions/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['me'],
      queryFn: me,
    });
    const t = await context.queryClient.ensureQueryData({
      queryKey: [queryKey],
      queryFn: getMyTransactions,
    });
    return t;
  },
});

function RouteComponent() {
  const t = Route.useLoaderData();
  console.log({ t });

  return (
    <main className="px-4">
      <section
        id="breadcrumb"
        className="flex py-6 justify-center md:justify-start text-foreground/50 items-center gap-2"
      >
        <p>Home</p>
        <ChevronRight />
        <p className="text-foreground">Transactions</p>
      </section>
      <div className="text-2xl font-bold">Transaction List</div>
    </main>
  );
}
