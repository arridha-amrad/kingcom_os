import useGetProductDetail from '@/hooks/product/useGetProductDetail';
import { useParams } from '@tanstack/react-router';

export default function Video() {
  const { slug } = useParams({ from: '/products/$slug' });
  const { data } = useGetProductDetail(slug);

  if (!data) return null;

  const match = data.video_url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/,
  );
  const embeddedUrl = match
    ? `https://www.youtube.com/embed/${match[1]}`
    : undefined;

  return (
    <div className="py-4">
      <h1 className="font-bold text-center text-2xl pb-8">{data.name}</h1>
      <div className="aspect-video w-full max-w-[800px] mx-auto">
        <iframe
          className="w-full h-full"
          src={embeddedUrl}
          title="YouTube Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
