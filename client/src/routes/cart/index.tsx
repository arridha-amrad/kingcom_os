import Carts from '@/components/Cart';
import OrderSummary from '@/components/OrderSummary';
import Spinner from '@/components/Spinner';
import { me } from '@/hooks/auth/useGetAuth';
import { getCart } from '@/hooks/product/useGetCart';
import { getProvinces } from '@/hooks/useShipping';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,

  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['me'],
      queryFn: me,
    });
    await context.queryClient.ensureQueryData({
      queryKey: ['get-cart'],
      queryFn: getCart,
    });
    await context.queryClient.ensureQueryData({
      queryKey: ['shipping-province'],
      queryFn: getProvinces,
    });
  },
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center mt-8 fill-foreground">
        <Spinner />
      </div>
    );
  },
});

function RouteComponent() {
  return (
    <main className="w-full mx-auto px-4">
      <section
        id="breadcrumb"
        className="flex py-6 justify-center md:justify-start text-foreground/50 items-center gap-2"
      >
        <p>Home</p>
        <ChevronRight />
        <p className="text-foreground">Cart</p>
      </section>
      <section className="w-full">
        <div className="flex lg:flex-row flex-col pt-6 gap-8">
          <Carts />
          <div className="w-full lg:max-w-md">
            <OrderSummary />
          </div>
        </div>
      </section>
      <div className="xl:mb-48 mb-16"></div>
    </main>
  );
}
