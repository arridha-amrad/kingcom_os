import { Tag } from 'lucide-react';

type Props = {
  discount: number | null;
  deliveryFee: number;
};

function OrderSummary({ discount, deliveryFee }: Props) {
  return (
    <div className="h-max w-full shrink-0 border space-y-6 border-foreground/20 p-6 rounded-3xl">
      <h1 className="font-bold text-2xl">Order Summary</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground/60 text-xl">SubTotal</h2>
          <h2 className="text-xl font-bold">${subtotal}</h2>
        </div>
        {discount && (
          <div className="flex items-center justify-between">
            <h2 className="text-foreground/60 text-xl">
              Discount (-{discount}%)
            </h2>
            <h2 className="text-xl font-bold text-red-500">${afterDiscount}</h2>
          </div>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-foreground/60 text-xl">Delivery Fee</h2>
          <h2 className="text-xl font-bold">${deliveryFee}</h2>
        </div>
      </div>
      <div className="w-full h-px bg-foreground/20"></div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl">Total</h2>
        <h2 className="text-2xl font-bold">${total}</h2>
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
        <button className="flex-1 h-full bg-foreground rounded-full text-background">
          Apply
        </button>
      </div>
      <button className="h-15 rounded-full w-full flex items-center justify-center gap-4 bg-foreground font-medium text-background">
        <span>Go to Checkout</span>
        <svg
          width="19"
          height="16"
          viewBox="0 0 19 16"
          className="fill-background"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.7959 0.454104L18.5459 7.2041C18.6508 7.30862 18.734 7.43281 18.7908 7.56956C18.8476 7.7063 18.8768 7.85291 18.8768 8.00098C18.8768 8.14904 18.8476 8.29565 18.7908 8.4324C18.734 8.56915 18.6508 8.69334 18.5459 8.79785L11.7959 15.5479C11.5846 15.7592 11.2979 15.8779 10.9991 15.8779C10.7002 15.8779 10.4135 15.7592 10.2022 15.5479C9.99084 15.3365 9.87211 15.0499 9.87211 14.751C9.87211 14.4521 9.99084 14.1654 10.2022 13.9541L15.0313 9.12504L1.25 9.12504C0.951632 9.12504 0.665483 9.00651 0.454505 8.79554C0.243527 8.58456 0.125 8.29841 0.125 8.00004C0.125 7.70167 0.243527 7.41552 0.454505 7.20455C0.665483 6.99357 0.951632 6.87504 1.25 6.87504L15.0313 6.87504L10.2013 2.04598C9.98991 1.83463 9.87117 1.54799 9.87117 1.2491C9.87117 0.950218 9.98991 0.663574 10.2013 0.45223C10.4126 0.240885 10.6992 0.122151 10.9981 0.122151C11.297 0.122151 11.5837 0.240885 11.795 0.45223L11.7959 0.454104Z" />
        </svg>
      </button>
    </div>
  );
}

export default OrderSummary;
