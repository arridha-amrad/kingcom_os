import { useGetAuth } from '@/hooks/auth/useGetAuth';
import { useGetCart } from '@/hooks/product/useGetCart';
import {
  useFindServices,
  type Courier,
  type IdWithName,
} from '@/hooks/useShipping';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import toast from 'react-hot-toast';

interface TContext {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  total: number | null;
  setTotal: Dispatch<SetStateAction<number | null>>;
  subTotal: number | null;
  setSubTotal: Dispatch<SetStateAction<number | null>>;
  discount: number | null;
  setDiscount: Dispatch<SetStateAction<number | null>>;
  courier: Courier | null;
  setCourier: Dispatch<SetStateAction<Courier | null>>;
  availableCouriers: Courier[];
  district: IdWithName | null;
  setDistrict: Dispatch<SetStateAction<IdWithName | null>>;
  promoCode: string;
  setPromoCode: Dispatch<SetStateAction<string>>;
  findAvailableCouriers: () => Promise<void>;
}

const Context = createContext<TContext | undefined>(undefined);

export default function OrderProvider({ children }: { children: ReactNode }) {
  const ORIGIN_ID = 1334;

  const [address, setAddress] = useState<string>('');
  const [total, setTotal] = useState<number | null>(null);
  const [subTotal, setSubTotal] = useState<number | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [courier, setCourier] = useState<null | Courier>(null);
  const [district, setDistrict] = useState<null | IdWithName>(null);
  const [availableCouriers, setAvailableCouriers] = useState<Courier[]>([]);
  const [promoCode, setPromoCode] = useState('');

  const { data: carts, dataUpdatedAt } = useGetCart(useGetAuth().data);

  useEffect(() => {
    setSubTotal(
      carts?.reduce((pv, cv) => {
        const price = cv.Product.price;
        const discount = cv.Product.discount;
        const priceAfterDiscount = price - (price * discount) / 100;
        const total = cv.quantity * priceAfterDiscount;
        pv += total;
        return pv;
      }, 0) ?? 0,
    );
  }, [dataUpdatedAt]);

  useEffect(() => {
    if (courier && subTotal) {
      setTotal(subTotal + courier.cost);
    }
    if (subTotal && !courier) {
      setTotal(subTotal);
    }
  }, [courier, subTotal]);

  const totalWeight = carts?.reduce(
    (pv, cv) => pv + cv.Product.weight * cv.quantity,
    0,
  );
  const { mutateAsync: findServices } = useFindServices();
  const findAvailableCouriers = async () => {
    if (!district || !totalWeight || !ORIGIN_ID) return;
    const id = toast.loading('Finding available courier services...');
    try {
      const result = await findServices({
        originId: ORIGIN_ID,
        destinationId: district.id,
        weight: totalWeight,
      });
      setAvailableCouriers(result);
      toast.dismiss(id);
    } catch (error) {
      console.error('Failed to fetch courier services:', error);
      toast.error('Failed to fetch courier services');
    }
  };

  return (
    <Context.Provider
      value={{
        address,
        discount,
        setAddress,
        setDiscount,
        setSubTotal,
        setTotal,
        subTotal,
        total,
        courier,
        setCourier,
        findAvailableCouriers,
        availableCouriers,
        setDistrict,
        district,
        promoCode,
        setPromoCode,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useOrder = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('useOrder must be wrapped with OrderProvider');
  }
  return ctx;
};
