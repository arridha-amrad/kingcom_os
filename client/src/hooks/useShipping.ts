import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type ProvinceResponse = {
  data: {
    id: number;
    name: string;
  }[];
};

export function useGetProvince() {
  return useQuery({
    queryKey: ['shipping-province'],
    queryFn: getProvinces,
    staleTime: 1000 * 60 * 24,
  });
}

export function useGetCities(provinceId: number | null | undefined) {
  return useQuery({
    queryKey: ['shipping-city', provinceId],
    queryFn: async () => {
      try {
        const res = await axios.get<ProvinceResponse>(
          `/api/city/${provinceId}`,
          {
            headers: {
              Key: import.meta.env.VITE_RAJA_ONGKIR_API_KEY,
            },
          },
        );
        return res.data.data;
      } catch (err) {
        throw new Error('failed to fetch provinces');
      }
    },
    staleTime: 1000 * 60 * 24,
    enabled: !!provinceId,
  });
}

export function useGetDistrict(cityId: number | null | undefined) {
  return useQuery({
    queryKey: ['shipping-district', cityId],
    queryFn: async () => {
      try {
        const res = await axios.get<ProvinceResponse>(
          `/api/district/${cityId}`,
          {
            headers: {
              Key: import.meta.env.VITE_RAJA_ONGKIR_API_KEY,
            },
          },
        );
        return res.data.data;
      } catch (err) {
        throw new Error('failed to fetch provinces');
      }
    },
    staleTime: 1000 * 60 * 24,
    enabled: !!cityId,
  });
}

export function useDistrictCalculateCost(
  originId: number,
  weight: number,
  destinationId?: number | null,
) {
  return useQuery({
    queryKey: ['shipping-cost', originId, destinationId, weight],
    enabled: !!originId && !!destinationId && !!weight,
    staleTime: 1000 * 60 * 24,
    queryFn: async () => {
      try {
        const response = await fetch('/calc/district/domestic-cost', {
          method: 'POST',
          headers: {
            key: import.meta.env.VITE_RAJA_ONGKIR_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            origin: originId.toString(),
            destination: (destinationId ?? 0).toString(),
            weight: weight.toString(),
            courier:
              'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse',
            price: 'lowest',
          }).toString(),
        });

        const data = await response.json();
        return data.data;
      } catch (err) {
        throw new Error('failed to calculate the cost');
      }
    },
  });
}

export const getProvinces = async () => {
  try {
    const res = await axios.get<ProvinceResponse>('/api/province', {
      headers: {
        Key: import.meta.env.VITE_RAJA_ONGKIR_API_KEY,
      },
    });
    return res.data.data;
  } catch (err) {
    throw new Error('failed to fetch provinces');
  }
};

export const getCities = async () => {
  try {
    const res = await axios.get<ProvinceResponse>('/api/city/{province_id}', {
      headers: {
        Key: import.meta.env.VITE_RAJA_ONGKIR_API_KEY,
      },
    });
    return res.data.data;
  } catch (err) {
    throw new Error('failed to fetch provinces');
  }
};
