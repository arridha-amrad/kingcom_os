import { privateAxios } from '@/lib/axiosInterceptor';
import type { MeResponse } from '@/types/api/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAuth = () => {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ['me'],
    retry(failureCount, error) {
      console.log('retry error : ', error);
      if (failureCount == 2) {
        localStorage.setItem('auth', 'false');
      }
      return failureCount === 2;
    },
    enabled: () => {
      const data = qc.getQueryData(['me']) as
        | MeResponse['user']
        | undefined
        | null;
      if (data) return false;
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
