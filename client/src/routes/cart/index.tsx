import Carts from '@/components/Cart';
import OrderSummary from '@/components/OrderSummary';
import { getCart } from '@/hooks/product/useGetCart';
import { privateAxios } from '@/lib/axiosInterceptor';
import { createFileRoute } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,
  beforeLoad(ctx) {
    ctx.context.queryClient.ensureQueryData({ queryKey: ['me'] });
  },
  loader({ context }) {
    return context.queryClient.ensureQueryData({
      queryKey: ['get-cart'],
      queryFn: getCart,
    });
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return <p>cart route</p>;
  // return (
  //   <main className="xl:max-w-7xl w-full mx-auto px-4">
  //     <div className="w-full h-px bg-[#f0f0f0] mx-auto"></div>
  //     <section
  //       id="breadcrumb"
  //       className="flex py-6 justify-center md:justify-start text-black/50 items-center gap-2"
  //     >
  //       <p>Home</p>
  //       <ChevronRight />
  //       <p className="text-black">Cart</p>
  //     </section>
  //     <section className="w-full">
  //       <h1 className="text-4xl font-bold font-header text-center md:text-start">
  //         Your Cart
  //       </h1>
  //       <div className="flex lg:flex-row flex-col pt-6 gap-8">
  //         {/* <Carts /> */}
  //         <div className="w-full lg:max-w-md">{/* <OrderSummary /> */}</div>
  //       </div>
  //     </section>
  //     <div className="xl:mb-48 mb-16"></div>
  //   </main>
  // );
}
