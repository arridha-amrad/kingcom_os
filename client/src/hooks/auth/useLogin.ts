import { publicAxios } from "@/lib/axiosInterceptor";
import type { LoginRequest, LoginResponse } from "@/types/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useLogin = () => {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: async (params: LoginRequest) => {
         try {
            const res = await publicAxios.post<LoginResponse>(`/auth`, params, {
               headers: {
                  "Content-Type": "application/json",
               },
            });
            const data = res.data;
            console.log({ data });
            return data;
         } catch (err: unknown) {
            console.log(err);
            if (err instanceof AxiosError) {
               throw new Error(err.message);
            }
         }
      },
      onSuccess(data) {
         if (!data) return;
         qc.setQueryData(["me"], data);
      },
   });
};
