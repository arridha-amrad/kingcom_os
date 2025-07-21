import { privateAxios } from "@/lib/axiosInterceptor";
import type { MeResponse } from "@/types/api/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAuth = () => {
   return useQuery({
      queryKey: ["me"],
      queryFn: async () => {
         try {
            const res = await privateAxios.get<MeResponse>("/auth");
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
