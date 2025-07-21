import { privateAxios } from "@/lib/axiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useLogout = () => {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: async () => {
         try {
            const res = await privateAxios.post("/auth/logout");
            const data = res.data;
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
         qc.setQueryData(["me"], null);
      },
   });
};
