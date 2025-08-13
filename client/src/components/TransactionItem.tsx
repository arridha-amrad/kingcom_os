import { useCheckout } from '@/hooks/transactions/useCheckout';
import type { Order } from '@/types/api/transaction';
import { transactionDateFormatter, formatToIdr } from '@/utils';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBasket, Ship } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
  item: Order;
}

export default function TransactionItem({ item }: Props) {
  const navigate = useNavigate();
  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);
  const { mutateAsync, isPending } = useCheckout(item.id);
  const checkout = async () => {
    const id = toast.loading('Please wait...');
    try {
      const result = await mutateAsync();
      window.snap.pay(result.token, {
        onSuccess: (data: any) => {
          console.log('payment success ', data);
          toast.success('checkout successful', { id });
          navigate({ to: '/transactions' });
        },
        onPending: function (data: any) {
          console.log('pending');
          console.log(data);
        },
        onError: function (data: any) {
          console.log('error');
          console.log(data);
        },
        onClose: function () {
          console.log(
            'customer closed the popup without finishing the payment',
          );
        },
      });
    } catch (err) {
      toast.error('something went wrong', { id });
    }
  };
  return (
    <div
      key={item.id}
      className="border border-foreground/20 rounded-2xl py-4 px-8 mt-4"
    >
      <div className="flex items-center gap-4">
        <ShoppingBasket className="size-6 stroke-foreground fill-foreground" />
        <h1>Shopping</h1>
        <p>{transactionDateFormatter(new Date(item.createdAt))}</p>
        <div className="text-background bg-foreground pt-1 px-4 pb-1.5 rounded">
          {item.status}
        </div>
        <p>{item.orderNumber}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-4">
          {item.orderItems.map((i) => (
            <div className="flex items-start gap-4" key={i.id}>
              <div className="pr-4">
                <img
                  className="size-25 object-cover aspect-square"
                  alt={i.product.images[0].url}
                  src={i.product.images[0].url}
                />
              </div>
              <div className="pt-4">
                <div className="line-clamp-1 font-semibold">
                  {i.product.name}
                </div>
                <div className="font-light text-foreground/70">
                  {i.quantity} x {formatToIdr(i.product.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center flex-col">
          <h1 className="font-bold">Order Total</h1>
          <h2>{formatToIdr(item.total)}</h2>
          <button
            onClick={checkout}
            disabled={isPending}
            className="bg-foreground disabled:brightness-75 mt-4 text-background px-4 py-2 rounded-2xl font-semibold"
          >
            Checkout
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-2xl w-fit py-2 bg-foreground text-background px-4">
        <div className="flex items-center gap-4">
          <Ship className="size-6 stroke-background" />
          <p>{item.shipping.service}</p>
          <p>{item.shipping.name}</p>
          <p>{item.shipping.etd}</p>
          <div>To: {item.shipping.address}</div>
          <div className="text-background">
            {formatToIdr(item.shipping.cost)}
          </div>
        </div>
      </div>
    </div>
  );
}
