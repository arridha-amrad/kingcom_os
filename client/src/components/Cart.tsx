import { Fragment, useEffect } from 'react';

function Cart({ items }: Props) {
  return (
    <div className="border space-y-8 flex-2 border-black/10 p-6 rounded-3xl">
      {cartItems.map((cart, i) => (
        <Fragment key={cart.id}>
          <CartItem key={cart.id} item={cart} />
          {i + 1 !== cartItems.length && (
            <div className="w-full h-px bg-black/10"></div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default Cart;
