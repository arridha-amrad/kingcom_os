export default function Video() {
  return (
    <div className="py-4">
      <h1 className="font-bold text-center text-2xl pb-8">
        Gigabyte Motherboard Intel Z890 Aorus Elite X Ice
      </h1>
      <div className="aspect-video w-full max-w-[800px] mx-auto">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/3JmFSwFBBj0"
          title="YouTube Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
