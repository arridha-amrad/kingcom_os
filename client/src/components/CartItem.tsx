"use client";

import { Trash } from "lucide-react";
import Image from "next/image";
import { Item, useCartStore } from "../stores/cartStore";
import ButtonQuantity from "./Button/ButtonQuantity";

type Props = {
  item: Item;
};

function CartItem({ item: { id, imageUrl, name, price, quantity } }: Props) {
  const addQuantity = useCartStore((store) => store.addQuantity);
  const subtractQuantity = useCartStore((store) => store.subtractQuantity);

  const onDecrease = () => {
    if (quantity === 1) return;
    subtractQuantity(id);
  };

  const onIncrease = () => {
    addQuantity(id);
  };

  return (
    <article className="flex gap-4 h-max">
      <div className="lg:size-[124px] size-[90px] shrink-0 rounded-3xl overflow-hidden">
        <Image
          width={250}
          height={250}
          src={imageUrl}
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
            <Trash className="fill-red-600 stroke-red-500" />
          </button>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row justify-between sm:items-center w-full">
          <h2 className="font-bold text-2xl">${price * quantity}</h2>
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
