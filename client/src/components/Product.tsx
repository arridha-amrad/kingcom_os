'use client';

import { useNavigate } from '@tanstack/react-router';
import Rating from './Rating';
import type { Product as TProduct } from '@/types/api/product';

type Props = {
  product: TProduct;
};

function Product({
  product: { discount, images, name, price, average_rating, slug },
}: Props) {
  const router = useNavigate();
  const imageUrl = images[0].url;
  return (
    <div
      onClick={() => {
        router({ to: `/products/${slug}` });
      }}
      className="relative cursor-pointer w-full px-8 py-4 hover:ring-2 rounded-xl transition-all duration-200 ease-linear ring-foreground/20 overflow-hidden space-y-2"
    >
      <div className="overflow-hidden w-full">
        <img
          width={500}
          height={500}
          src={imageUrl}
          alt="new arrivals"
          className="w-full object-cover aspect-square"
        />
      </div>
      <h1 className="font-bold xl:text-[20px]">{name}</h1>
      {average_rating && <Rating value={average_rating} />}
      <div className="flex items-center gap-3">
        {discount && (
          <h2 className="font-bold xl:text-2xl text-xl">
            ${price - (price * discount) / 100}
          </h2>
        )}
        <h2
          className={`font-bold xl:text-2xl text-xl ${
            discount ? 'opacity-40' : 'opacity-100'
          }`}
        >
          ${price}
        </h2>
        {discount && (
          <div className="bg-red-500/10 text-red-500 rounded-full font-medium text-xs flex items-center justify-center py-1 px-2">
            -{discount}%
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
