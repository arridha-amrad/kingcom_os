import useGetProductDetail from '@/hooks/product/useGetProductDetail';
import { useParams } from '@tanstack/react-router';

export default function Specifications() {
  const { slug } = useParams({ from: '/products/$slug' });
  const { data } = useGetProductDetail(slug);
  if (!data) return;
  const items = data.specification.split('\n').map((v) => v.replace('-', ''));
  return (
    <div className="py-4">
      <h1 className="font-bold text-2xl pb-4">{data.name}</h1>
      {
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      }
    </div>
  );
}
