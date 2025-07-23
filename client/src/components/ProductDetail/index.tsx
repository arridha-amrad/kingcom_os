import { useState } from 'react';
import Description from './Description';
import { cn } from '@/utils';
import useGetProductDetail from '@/hooks/product/useGetProductDetail';
import { useParams } from '@tanstack/react-router';

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
