import ReviewCard from "./ProductDetail/Tab/Reviews/ReviewCard";

const data = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    date: new Date(),
    comment:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: "Alex K",
    rating: 5,
    date: new Date(),
    comment:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions",
  },
  {
    id: 3,
    date: new Date(),
    name: "James L.",
    rating: 5,
    comment:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
];

function Testimony() {
  return (
    <section id="testimony" className="pb-10 px-4">
      <div className="mt-16 mb-12 xl:max-w-7xl mx-auto">
        <h1 className="font-header font-bold text-5xl">Our Happy Customers</h1>
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 grid-rows-1">
        {data.map((v) => (
          <ReviewCard key={v.id} review={v} />
        ))}
      </div>
    </section>
  );
}

export default Testimony;
