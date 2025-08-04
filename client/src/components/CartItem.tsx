'use client';

import { Trash } from 'lucide-react';
import ButtonQuantity from './Button/ButtonQuantity';
import {
  decreaseQuantity,
  increaseQuantity,
  type Cart,
} from '@/hooks/product/useGetCart';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  item: Cart;
}

function CartItem({
  item: {
    Product: { discount, image, price, name, weight },
    quantity,
    id,
  },
}: Props) {
  const qc = useQueryClient();

  const onDecrease = () => {
    if (quantity === 1) return;
    decreaseQuantity(qc, id);
  };

  const onIncrease = () => {
    increaseQuantity(qc, id);
  };

  return (
    <article className="flex gap-4 h-max">
      <div className="lg:size-[124px] size-[90px] shrink-0 rounded-3xl overflow-hidden">
        <img
          width={250}
          height={250}
          src={image}
          alt="cart image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full flex flex-col justify-center gap-2">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <h1 title={name} className="font-bold text-xl line-clamp-1">
            {name}
          </h1>
          <button
            title="delete from cart"
            className="size-10 rounded-full flex items-center justify-center"
          >
            <Trash className="stroke-red-400" />
          </button>
        </div>
        <div className="text-foreground/50">
          <p>Price : {price}</p>
          <div className="inline ">
            Discount :
            <p className="bg-red-500/10 w-fit inline text-red-500 rounded-full font-medium text-xs ml-2 py-1 px-2">
              -{discount}%
            </p>
          </div>
          <p>Categories : Motherboard</p>
          <p>Weight : {weight} gram</p>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row justify-between sm:items-center w-full">
          <h2 className="font-bold text-2xl">
            $
            {Math.ceil((price - (price * discount) / 100) * quantity * 10) / 10}
          </h2>
          <ButtonQuantity
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            value={quantity}
          />
        </div>
      </div>
    </article>
  );
}

export default CartItem;
