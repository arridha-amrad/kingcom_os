import { privateAxios } from '@/lib/axiosInterceptor';
import type { MeResponse } from '@/types/api/auth';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAuth = () => {
  return useQuery({
    queryKey: ['me'],
    retry(failureCount) {
      if (failureCount == 2) {
        localStorage.setItem('auth', 'false');
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // optional: reduce unnecessary refetching
    enabled: () => {
      const auth = localStorage.getItem('auth');
      return auth ? auth === 'true' : false;
    },
    queryFn: async () => {
      try {
        const res = await privateAxios.get<MeResponse>('/auth');
        return res.data.user;
      } catch (err: unknown) {
        console.log(err);
        if (err instanceof AxiosError) {
          throw new Error(err.message);
        }
      }
    },
  });
};
