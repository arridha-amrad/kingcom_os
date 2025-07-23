import useAddToCart from '@/hooks/product/useAddtoCart';
import toast from 'react-hot-toast';

interface Props {
  productId: string;
  quantity: number;
}

export default function AddToCart({ productId, quantity }: Props) {
  const { mutateAsync, isPending } = useAddToCart();

  const addToCart = async () => {
    const id = toast.loading('Adding to cart...');
    try {
      await mutateAsync({
        productId,
        quantity,
      });
      toast.success('Added to cart', { id });
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message, { id });
      }
    }
  };
  return (
    <button
      disabled={isPending}
      onClick={addToCart}
      className="flex-2 disabled:brightness-75 font-semibold h-13 bg-foreground text-background rounded-full"
    >
      Add To Cart
    </button>
  );
}
