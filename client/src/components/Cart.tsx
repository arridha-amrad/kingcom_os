import { useGetCart } from '@/hooks/product/useGetCart';
import { Fragment } from 'react';
import CartItem from './CartItem';
import Spinner from './Spinner';
import { useGetAuth } from '@/hooks/auth/useGetAuth';

function Cart() {
  const { data: auth } = useGetAuth();
  const { data, isPending } = useGetCart(auth);
  if (isPending) {
    return (
      <div className="flex items-center justify-center fill-foreground">
        <Spinner />
      </div>
    );
  }
  if (!data) return null;
  return (
    <div className="border space-y-8 flex-2 border-foreground/10 p-6 rounded-3xl">
      {data.map((cart, i) => (
        <Fragment key={cart.id}>
          <CartItem key={cart.id} item={cart} />
          {i + 1 !== data.length && (
            <div className="w-full h-px bg-foreground/10"></div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default Cart;
