import { useGetAuth } from '@/hooks/auth/useGetAuth';
import { useGetCart } from '@/hooks/product/useGetCart';
import { useCreateOrder } from '@/hooks/transactions/useCreateOrder';
import { useFindServices, type Courier } from '@/hooks/useShipping';
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
  deliveryFee: number | null;
  setDeliveryFee: Dispatch<SetStateAction<number | null>>;
  subTotal: number | null;
  setSubTotal: Dispatch<SetStateAction<number | null>>;
  discount: number | null;
  setDiscount: Dispatch<SetStateAction<number | null>>;
  courier: Courier | null;
  setCourier: Dispatch<SetStateAction<Courier | null>>;
  availableCouriers: Courier[];
  setBuyerDistrictId: Dispatch<SetStateAction<number | null>>;
  placeMyOrder: () => Promise<void>;
  findAvailableCouriers: () => Promise<void>;
}

const Context = createContext<TContext | undefined>(undefined);

export default function OrderProvider({ children }: { children: ReactNode }) {
  const ORIGIN_ID = 1334;

  const [address, setAddress] = useState<string>('');
  const [total, setTotal] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [subTotal, setSubTotal] = useState<number | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [courier, setCourier] = useState<null | Courier>(null);
  const [buyerDistrictId, setBuyerDistrictId] = useState<null | number>(null);
  const [availableCouriers, setAvailableCouriers] = useState<Courier[]>([]);

  const { data: carts, dataUpdatedAt } = useGetCart(useGetAuth().data);

  useEffect(() => {
    setSubTotal(
      carts?.reduce((pv, cv) => (pv += cv.quantity * cv.Product.price), 0) ?? 0,
    );
  }, [dataUpdatedAt]);

  useEffect(() => {
    if (courier && subTotal) {
      setDeliveryFee(courier.cost);
      setTotal(subTotal + courier.cost);
    }
  }, [courier, subTotal]);

  const { mutateAsync } = useCreateOrder();

  const placeMyOrder = async () => {
    if (!total || !carts || carts.length === 0 || !courier || !address) {
      return;
    }
    const id = toast.loading('Processing your order...', { removeDelay: 500 });
    const body = {
      total,
      items: carts?.map((c) => ({
        productId: c.Product.id,
        quantity: c.quantity,
      })),
      shipping: {
        ...courier,
        address,
      },
    };
    try {
      await mutateAsync(body);
      console.log(body);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message, { id });
      }
      toast.error('something went wrong', { id });
    }
  };

  const totalWeight = carts?.reduce(
    (pv, cv) => pv + cv.Product.weight * cv.quantity,
    0,
  );
  const { mutateAsync: findServices } = useFindServices();
  const findAvailableCouriers = async () => {
    if (!buyerDistrictId || !totalWeight || !ORIGIN_ID) return;
    const id = toast.loading('Finding available courier services...', {
      removeDelay: 500,
    });
    try {
      const result = await findServices({
        originId: ORIGIN_ID,
        destinationId: buyerDistrictId,
        weight: totalWeight,
      });
      setAvailableCouriers(result);
    } catch (error) {
      console.error('Failed to fetch courier services:', error);
      toast.error('Failed to fetch courier services', { id, removeDelay: 500 });
    } finally {
      toast.dismiss(id);
    }
  };

  return (
    <Context.Provider
      value={{
        address,
        deliveryFee,
        discount,
        setAddress,
        setDeliveryFee,
        setDiscount,
        setSubTotal,
        setTotal,
        subTotal,
        total,
        courier,
        setCourier,
        placeMyOrder,
        findAvailableCouriers,
        availableCouriers,
        setBuyerDistrictId,
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
