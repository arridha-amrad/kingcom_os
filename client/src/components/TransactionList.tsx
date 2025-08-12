import { useGetAuth } from '@/hooks/auth/useGetAuth';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { formatToIdr, transactionDateFormatter } from '@/utils';
import { Ship, ShoppingBag, ShoppingBasket, ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TransactionList() {
  const { data: authUser } = useGetAuth();
  const { data: transactions, error, isError } = useGetTransactions(authUser);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError]);

  return transactions?.map((t) => (
    <div
      key={t.id}
      className="border border-foreground/20 rounded-2xl py-4 px-8 mt-4"
    >
      <div className="flex items-center gap-4">
        <ShoppingBasket className="size-6 stroke-foreground fill-foreground" />
        <h1>Shopping</h1>
        <p>{transactionDateFormatter(new Date(t.createdAt))}</p>
        <div className="text-background bg-foreground pt-1 px-4 pb-1.5 rounded">
          {t.status}
        </div>
        <p>{t.orderNumber}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-4">
          {t.orderItems.map((i) => (
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
          <h2>{formatToIdr(t.total)}</h2>
          <button className="bg-foreground mt-4 text-background px-4 py-2 rounded-2xl font-semibold">
            Checkout
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-2xl w-fit py-2 bg-foreground text-background px-4">
        <div className="flex items-center gap-4">
          <Ship className="size-6 stroke-background" />
          <p>{t.shipping.service}</p>
          <p>{t.shipping.name}</p>
          <p>{t.shipping.etd}</p>
          <div>To: {t.shipping.address}</div>
          <div className="text-background">{formatToIdr(t.shipping.cost)}</div>
        </div>
      </div>
    </div>
  ));
}
