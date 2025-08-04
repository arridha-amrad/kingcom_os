import {
  getAccessToken,
  privateAxios,
  setAccessToken,
} from '@/lib/axiosInterceptor';
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
    staleTime: 5 * 60 * 1000,
    enabled: () => {
      const auth = localStorage.getItem('auth');
      return !!auth && auth === 'true';
    },
    queryFn: me,
  });
};

export const me = async () => {
  try {
    if (!getAccessToken()) {
      await refreshToken();
    }
    const res = await privateAxios.get<MeResponse>('/auth');
    return res.data.user;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof AxiosError) {
      throw new Error(err.message);
    }
  }
};

export const refreshToken = async () => {
  try {
    const res = await privateAxios.post('/auth/refresh-token');
    const newToken = res.data.token;
    setAccessToken(newToken);
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof AxiosError) {
      throw new Error(err.message);
    }
  }
};
