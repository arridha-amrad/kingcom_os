import { formatToIdr } from '@/utils';
import { ArrowRightIcon, Tag } from 'lucide-react';
import ModalChooseCourier from './Modals/ModalChooseCourier';
import { useOrder } from './Providers/OrderProvider';
import { useCreateOrder } from '@/hooks/transactions/useCreateOrder';
import { useGetCart } from '@/hooks/product/useGetCart';
import { useGetAuth } from '@/hooks/auth/useGetAuth';
import toast from 'react-hot-toast';

function OrderSummary() {
  const { subTotal, total, courier, promoCode, setPromoCode, address } =
    useOrder();

  const { data: authUser } = useGetAuth();
  const { data: carts } = useGetCart(authUser);
  const { mutateAsync, isPending } = useCreateOrder();

  const placeMyOrder = async () => {
    if (!total || !carts || carts.length === 0 || !courier || !address) {
      return;
    }
    const body = {
      total,
      items: carts?.map((c) => ({
        cartId: c.id,
        productId: c.Product.id,
        quantity: c.quantity,
      })),
      shipping: {
        ...courier,
        address,
      },
    };
    const id = toast.loading('Processing your order...', { removeDelay: 500 });
    try {
      await mutateAsync(body);
      toast.success('Your order has been placed successfully', { id });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message, { id });
      }
      toast.error('something went wrong', { id });
    }
  };

  return (
    <div className="h-max w-full shrink-0 border space-y-6 border-foreground/20 p-6 rounded-3xl">
      <h1 className="font-bold text-2xl">Order Summary</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground/60 text-xl">SubTotal</h2>
          <h2 className="text-xl font-bold">{formatToIdr(subTotal ?? 0)}</h2>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-foreground/60 text-xl">Delivery Fee</h2>
          {courier ? (
            <h2 className="text-xl font-bold">{formatToIdr(courier.cost)}</h2>
          ) : (
            <ModalChooseCourier />
          )}
        </div>
      </div>
      <div className="w-full h-px bg-foreground/20"></div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl">Total</h2>
        <h2 className="text-2xl font-bold">{formatToIdr(total ?? 0)}</h2>
      </div>
      <div className="h-12 w-full flex gap-4 items-center">
        <div className="flex-2 h-full">
          <div className="relative bg-foreground/10 text-foreground w-full h-full rounded-full overflow-hidden">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              type="text"
              placeholder="Add promo code"
              className="w-full h-full outline-0 pr-4 pl-12"
            />
            <div className="absolute pl-1 size-12 top-0 left-0 flex items-center justify-center">
              <Tag className="text-foreground/50" />
            </div>
          </div>
        </div>
        <button
          disabled={isPending || !promoCode}
          className="flex-1 disabled:brightness-75 disabled:cursor-default font-medium h-full bg-foreground rounded-full text-background"
        >
          Apply
        </button>
      </div>
      <button
        disabled={!courier || isPending}
        onClick={placeMyOrder}
        className="h-15 rounded-full w-full disabled:cursor-default flex items-center justify-center gap-4 bg-foreground font-medium text-background disabled:brightness-75"
      >
        <span className="font-medium">Go to Checkout</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
}

export default OrderSummary;
