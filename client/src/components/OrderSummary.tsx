import { formatToIdr } from '@/utils';
import { ArrowRightIcon, Tag } from 'lucide-react';
import ModalChooseCourier from './Modals/ModalChooseCourier';
import { useOrder } from './Providers/OrderProvider';

function OrderSummary() {
  const { deliveryFee, subTotal, total, placeMyOrder } = useOrder();

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
          {deliveryFee ? (
            <h2 className="text-xl font-bold">{formatToIdr(deliveryFee)}</h2>
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
