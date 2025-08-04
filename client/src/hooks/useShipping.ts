import { publicAxios } from '@/lib/axiosInterceptor';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetProvince() {
  return useQuery({
    queryKey: ['shipping-province'],
    queryFn: getProvinces,
    staleTime: 1000 * 60 * 5,
  });
}
export const getProvinces = async () => {
  try {
    const res = await publicAxios.get<Response>('/shipping/get-provinces');
    return res.data.data;
  } catch (err) {
    throw new Error('failed to fetch provinces');
  }
};

export function useGetCities(provinceId: Nun) {
  return useQuery({
    queryKey: ['shipping-city', provinceId],
    queryFn: async () => {
      try {
        const res = await publicAxios.get<Response>(
          `/shipping/get-cities/${provinceId}`,
        );
        return res.data.data;
      } catch (err) {
        throw new Error('failed to fetch provinces');
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!provinceId,
  });
}

export function useGetDistricts(cityId: Nun) {
  return useQuery({
    queryKey: ['shipping-district', cityId],
    queryFn: async () => {
      try {
        const res = await publicAxios.get<Response>(
          `/shipping/get-districts/${cityId}`,
        );
        return res.data.data;
      } catch (err) {
        throw new Error('failed to fetch districts');
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!cityId,
  });
}

export function useFindServices() {
  return useMutation({
    mutationFn: async (params: ShippingCostParams) => {
      try {
        const res = await publicAxios.post<ShippingCostResponse>(
          '/shipping/calc-cost',
          params,
        );
        const data = res.data.data;
        if (data.length > 5) {
          return data.slice(0, 5);
        }
        return data;
      } catch (err) {
        throw new Error('failed to calculate the cost');
      }
    },
  });
}

export type Courier = ShippingCostResponse['data'][number];

type ShippingCostParams = {
  originId: number;
  destinationId: number;
  weight: number;
};

type ShippingCostResponse = {
  data: {
    name: string;
    code: string;
    service: string;
    description: string;
    cost: number;
    etd: string;
  }[];
};

type Response = {
  data: {
    id: number;
    name: string;
  }[];
};

export type IdWithName = {
  id: number;
  name: string;
};

type Nun = number | undefined | null;
