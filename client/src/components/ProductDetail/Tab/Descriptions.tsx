import useGetProductDetail from '@/hooks/product/useGetProductDetail';
import { useParams } from '@tanstack/react-router';

export default function Description() {
  const { slug } = useParams({ from: '/products/$slug' });
  const { data } = useGetProductDetail(slug);
  if (!data) return null;
  return (
    <div className="py-4">
      <h1 className="font-bold text-2xl pb-4">{data.name}</h1>
      <p className="whitespace-pre-line">{data.description}</p>
    </div>
  );
}
