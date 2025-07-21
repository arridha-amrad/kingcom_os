import useCreateProduct from "@/hooks/product/useCreateProduct";
import { useAppForm } from "@/hooks/useAppForm";
import { createProductSchema } from "@/schemas/product";
import toast from "react-hot-toast";

export default function FormAddProduct() {
   const { mutateAsync, isPending } = useCreateProduct();
   const form = useAppForm({
      defaultValues: {
         name: "",
         price: 0,
         description: "",
         specification: "",
      },
      validators: {
         onChange: createProductSchema,
      },
      onSubmit: async ({ value }) => {
         const id = toast.loading("Submitting new product data...");
         try {
            await mutateAsync(value);
            toast.success("New product added", { id });
         } catch (err: unknown) {
            if (err instanceof Error) {
               toast.error(err.message, { id });
            }
         }
      },
   });
   return (
      <fieldset disabled={isPending}>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               e.stopPropagation();
               form.handleSubmit();
            }}
            className="my-8 space-y-8"
         >
            <form.AppField name="name">
               {(field) => <field.ProductTextArea label="Product's Name" />}
            </form.AppField>
            <form.AppField name="price">
               {(field) => <field.ProductInputNumber label="Product's Price" />}
            </form.AppField>
            <form.AppField name="description">
               {(field) => <field.ProductTextArea label="Product's Description" />}
            </form.AppField>
            <form.AppField name="specification">
               {(field) => <field.ProductTextArea label="Product's Specification" />}
            </form.AppField>
            <form.AppForm>
               <form.ProductSubmitButton />
            </form.AppForm>
         </form>
      </fieldset>
   );
}
