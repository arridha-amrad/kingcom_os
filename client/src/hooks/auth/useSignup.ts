import { publicAxios } from "@/lib/axiosInterceptor";
import type { SignupRequest, SignupResponse } from "@/types/api/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useSignup = () => {
   return useMutation({
      mutationFn: async (params: SignupRequest) => {
         try {
            const res = await publicAxios.post<SignupResponse>(`/auth/register`, params, {
               headers: {
                  "Content-Type": "application/json",
               },
            });
            return res.data;
         } catch (err: unknown) {
            console.log(err);
            if (err instanceof AxiosError) {
               throw new Error(err.message);
            }
         }
      },
   });
};
