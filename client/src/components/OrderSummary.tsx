import { useGetAuth } from '@/hooks/auth/useGetAuth';
import { useGetCart } from '@/hooks/product/useGetCart';
import { formatToIdr } from '@/utils';
import { ArrowRightIcon, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import ModalChooseCourier from './Modals/ModalChooseCourier';
import { useCreateOrder } from '@/hooks/transactions/useCreateOrder';
import toast from 'react-hot-toast';
import type { Courier } from '@/hooks/useShipping';

type Order = {
  subTotal: number | null;
  deliveryFee: number | null;
  discount: number | null;
  total: number | null;
};

function OrderSummary() {
  const { data: carts, dataUpdatedAt } = useGetCart(useGetAuth().data);
  const subTotal = carts?.reduce(
    (pv, cv) => (pv += cv.quantity * cv.Product.price),
    0,
  );
  useEffect(() => {
    setOrderState((prev) => ({
      ...prev,
      subTotal: subTotal || 0,
      total: (subTotal || 0) + (prev.deliveryFee || 0),
    }));
  }, [dataUpdatedAt]);

  const [orderState, setOrderState] = useState<Order>({
    subTotal: null,
    deliveryFee: null,
    total: null,
    discount: null,
  });

  const setDeliveryFee = (fee: number) => {
    setOrderState((prev) => ({
      ...prev,
      deliveryFee: fee,
      total: (prev.subTotal ?? 0) + fee,
    }));
  };

  const [courier, setCourier] = useState<null | Courier>(null);
  const [address, setAddress] = useState("")

  const { mutateAsync, isPending } = useCreateOrder();

  const placeMyOrder = async () => {
    if (!orderState.total || !carts || carts.length === 0 || !courier || !address) return;
    const id = toast.loading('Processing your order...');
    try {
      await mutateAsync({
        total: orderState.total,
        items: carts?.map((c) => ({
          productId: c.Product.id,
          quantity: c.quantity,
        })),
        shipping: {
          ...courier,
          address: 
        },
      });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message, { id });
      }
    } finally {
      toast.dismiss(id);
    }
  };

  if (!carts) return null;

  return (
    <div className="h-max w-full shrink-0 border space-y-6 border-foreground/20 p-6 rounded-3xl">
      <h1 className="font-bold text-2xl">Order Summary</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground/60 text-xl">SubTotal</h2>
          <h2 className="text-xl font-bold">
            {formatToIdr(orderState.subTotal ?? 0)}
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-foreground/60 text-xl">Delivery Fee</h2>
          {orderState.deliveryFee ? (
            <h2 className="text-xl font-bold">
              {formatToIdr(orderState.deliveryFee)}
            </h2>
          ) : (
            <ModalChooseCourier setCourier={setCourier} setAddress={setAddress} setDeliveryFee={setDeliveryFee} />
          )}
        </div>
      </div>
      <div className="w-full h-px bg-foreground/20"></div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl">Total</h2>
        <h2 className="text-2xl font-bold">
          {formatToIdr(orderState.total ?? 0)}
        </h2>
      </div>
      <div className="h-12 w-full flex gap-4 items-center">
        <div className="flex-2 h-full">
          <div className="relative bg-foreground/10 text-foreground w-full h-full rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Add promo code"
              className="w-full h-full outline-0 pr-4 pl-12"
            />
            <div className="absolute pl-1 size-12 top-0 left-0 flex items-center justify-center">
              <Tag className="text-foreground/50" />
            </div>
          </div>
        </div>
        <button className="flex-1 font-medium h-full bg-foreground rounded-full text-background">
          Apply
        </button>
      </div>
      <button
        onClick={placeMyOrder}
        className="h-15 rounded-full w-full flex items-center justify-center gap-4 bg-foreground font-medium text-background"
      >
        <span className="font-medium">Go to Checkout</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
}

export default OrderSummary;
