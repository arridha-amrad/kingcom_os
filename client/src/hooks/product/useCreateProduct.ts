import type { CreteProductRequest } from "@/types/api/product";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useCreateProduct() {
   return useMutation({
      mutationKey: ["create-product"],
      mutationFn: async (params: CreteProductRequest) => {
         try {
            console.log({ params });
         } catch (err: unknown) {
            console.log(err);
            if (err instanceof AxiosError) {
               throw new Error(err.response?.data);
            }
         }
      },
   });
}
