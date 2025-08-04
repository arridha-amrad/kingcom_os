import { privateAxios } from '@/lib/axiosInterceptor';
import type { User } from '@/types/api/auth';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useGetCart(auth: User | undefined) {
  const query = useQuery({
    queryKey: ['get-cart'],
    queryFn: getCart,
    enabled: !!auth,
    retry(failureCount) {
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // optional: reduce unnecessary refetching
  });
  return query;
}

export const getCart = async () => {
  try {
    const res = await privateAxios.get<GetCartResponse>('/products/cart');
    const data = res.data;
    return data.cart;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data.error);
    }
    throw new Error('something went wrong');
  }
};

export const increaseQuantity = (qc: QueryClient, cartId: string) => {
  qc.setQueryData(
    ['get-cart'],
    (oldData: Cart[] | undefined) =>
      oldData?.map((v) =>
        v.id === cartId
          ? {
              ...v,
              quantity: v.quantity + 1,
            }
          : v,
      ) ?? [],
  );
};
export const decreaseQuantity = (qc: QueryClient, cartId: string) => {
  qc.setQueryData(
    ['get-cart'],
    (oldData: Cart[] | undefined) =>
      oldData?.map((v) =>
        v.id === cartId
          ? {
              ...v,
              quantity: v.quantity - 1,
            }
          : v,
      ) ?? [],
  );
};

export interface GetCartResponse {
  cart: Cart[];
}

export interface Cart {
  id: string;
  userId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  Product: {
    id: string;
    name: string;
    price: number;
    image: string;
    discount: number;
    weight: number;
  };
}
