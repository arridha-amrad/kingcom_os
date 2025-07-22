import { ChevronDown } from 'lucide-react';

import ModalFilter from './ModalFilter';
import useGetProducts from '@/hooks/product/useGetProducts';
import Spinner from './Spinner';
import ProductCard from './Product';

const data = [
  {
    id: 1,
    name: 'Z890 AORUS ELITE X ICE',
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/Z890%20AORUS%20ELITE%20X%20ICE.png?updatedAt=1747086239357`,
    price: 260,
    discount: 20,
    rating: 4,
  },
  {
    id: 2,
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/Z890%20AORUS%20XTREME%20AI%20TOP.png?updatedAt=1747086239291`,
    name: 'Z890 AORUS XTREME AI TOP.',
    price: 180,
    discount: 5,
    rating: 4.5,
  },
  {
    id: 3,
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/Z890%20AORUS%20TACHYON%20ICE.png?updatedAt=1747086238875`,
    price: 130,
    discount: 10,
    rating: 4,
    name: 'Z890 AORUS TACHYON ICE',
  },
  {
    id: 4,
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/Z590%20AORUS%20XTREME%20(rev.%201.0).png?updatedAt=1747086238251`,
    name: 'Z590 AORUS XTREME (rev. 1.0)',
    price: 145,
    discount: 20,
    rating: 4.5,
  },
  {
    id: 5,
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/X870E%20AORUS%20MASTER.png?updatedAt=1747086238056`,
    price: 80,
    name: 'X870E AORUS MASTER',
    discount: null,
    rating: 3.5,
  },
  {
    id: 6,
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/X570%20AORUS%20XTREME%20(rev.%201.2).png?updatedAt=1747086234336`,
    name: 'X570 AORUS XTREME (rev. 1.2)',
    price: 120,
    rating: 4,
    discount: 4,
  },
  {
    id: 7,
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/AMD%20Ryzen%20R5-5600G.webp?updatedAt=1747086232848`,
    price: 160,
    name: 'AMD Ryzen R5-5600G.',
    discount: null,
    rating: 4.5,
  },
  {
    id: 8,
    imageUrl:
      'https://ik.imagekit.io/o12xdvxz5l/KingCom/Radeon%E2%84%A2%20RX%20590%20GAMING%208G%20(rev.%201.0).png?updatedAt=1747086234395',
    name: 'Radeon™ RX 590 GAMING 8G (rev. 1.0)',
    price: 110,
    discount: 5,
    rating: 3.5,
  },
  {
    id: 9,
    name: 'GeForce RTX™ 5060 Ti GAMING OC 16G',
    imageUrl: `https://ik.imagekit.io/o12xdvxz5l/KingCom/GeForce%20RTX%E2%84%A2%205060%20Ti%20GAMING%20OC%2016G.png?updatedAt=1747086234719`,
    price: 100,
    rating: 4,
    discount: null,
  },
];

function Products() {
  const { data, isPending } = useGetProducts();

  return (
    <section id="products" className="flex-1 space-y-4">
      <div className="md:flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">Products</h1>
          <ModalFilter />
        </div>
        <div className="flex gap-2">
          <p className="text-center">
            Showing 1-9 of 100 Products. Sort by:&nbsp;
          </p>
          <div className="font-bold flex items-center gap-2">
            Most Popular
            <ChevronDown />
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-3 grid-cols-2 gap-y-8 gap-x-4 w-full">
        {isPending && (
          <div className="fill-background/50">
            <Spinner />
          </div>
        )}
        {data && data.map((pr, i) => <ProductCard product={pr} key={i} />)}
      </div>
    </section>
  );
}

export default Products;
