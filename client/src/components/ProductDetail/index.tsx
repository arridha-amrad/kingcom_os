'use client';

import { useState } from 'react';
import Description from './Description';
import { cn } from '@/utils';
import useGetProductDetail from '@/hooks/product/useGetProductDetail';
import { useParams } from '@tanstack/react-router';

// const data = {
//   id: 1,
//   name: 'Gigabyte Motherboard Intel Z890 Aorus Elite X Ice',
//   rating: 4.5,
//   discount: 40,
//   price: 1790,
//   description:
//     'Motherboard ini dirancang untuk mendukung prosesor Intel® Core™ Ultra (Seri 2), menghadirkan performa canggih dengan solusi VRM 16+1+2 fase berbasis digital twin untuk kestabilan daya yang optimal. Dilengkapi dengan D5 Bionic Corsa, sistem ini memungkinkan performa memori yang luar biasa dan tak terbatas, didukung oleh kompatibilitas memori DDR5 dengan dukungan modul XMP.',
//   images: [
//     'https://ik.imagekit.io/o12xdvxz5l/KingCom/Z890%20AORUS%20ELITE%20X%20ICE.png?updatedAt=1747086239357',
//     'https://ik.imagekit.io/o12xdvxz5l/KingCom/Gigabyte%20Motherboard%20Intel%20Z890%20Aorus%20Elite%20X%20Ice%204.png?updatedAt=1747124148011',
//     'https://ik.imagekit.io/o12xdvxz5l/KingCom/Gigabyte%20Motherboard%20Intel%20Z890%20Aorus%20Elite%20X%20Ice%202.png?updatedAt=1747124147932',
//     'https://ik.imagekit.io/o12xdvxz5l/KingCom/Gigabyte%20Motherboard%20Intel%20Z890%20Aorus%20Elite%20X%20Ice%203.png?updatedAt=1747124148077',
//   ],
// };

function ProductDetail() {
  const { slug } = useParams({ from: '/products/$slug' });
  const { data } = useGetProductDetail(slug);
  const [showImage, setShowImage] = useState(data?.images[0]);
  if (!data) return null;
  return (
    <section
      id="product-detail"
      className="lg:flex block items-start justify-center lg:justify-start px-4 gap-8 w-full lg:min-h-[530px] mb-16 mx-auto"
    >
      <div className="lg:flex hidden flex-col gap-2 h-full">
        {data.images.map((img, i) => (
          <div
            key={i}
            className={cn(
              'aspect-square overflow-hidden rounded-xl',
              img === showImage &&
                'ring-2 ring-offset-2 ring-offset-background ring-foreground/50',
            )}
            onClick={() => {
              setShowImage(img);
            }}
          >
            <img
              className="aspect-square object-cover"
              src={img.url}
              alt={img.product_id}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
      <div className="w-[444px] lg:block flex justify-self-center lg:shrink-0 h-full rounded-3xl overflow-hidden">
        <div className="w-full h-[530px] overflow-hidden">
          <img
            src={showImage?.url}
            alt="details"
            width={444}
            height={530}
            className="object-cover h-full w-full"
          />
        </div>
      </div>
      <div className="lg:hidden flex gap-2 h-max w-full justify-center my-4">
        {data.images.map((img, i) => (
          <div
            key={i}
            className={cn(
              'aspect-square overflow-hidden rounded-xl',
              img === showImage &&
                'ring-2 ring-offset-2 ring-offset-background ring-foreground/50',
            )}
            onClick={() => {
              setShowImage(img);
            }}
          >
            <img
              className="aspect-square object-cover"
              src={img.url}
              alt={img.product_id}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
      <Description
        data={{
          description: data.description,
          discount: data.discount,
          id: data.id,
          images: data.images.map((v) => v.url),
          name: data.name,
          price: data.price,
          rating: data.average_rating,
        }}
      />
    </section>
  );
}

export default ProductDetail;
