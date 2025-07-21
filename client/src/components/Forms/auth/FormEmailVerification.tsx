import { useVerify } from "@/hooks/auth/useVerify";
import { useAppForm } from "@/hooks/useAppForm";
import { setAccessToken } from "@/lib/axiosInterceptor";
import { emailVerificationSchema } from "@/schemas/auth";
import { Description, DialogTitle } from "@headlessui/react";
import { type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";

interface Props {
   registrationResult: {
      message: string;
      token: string;
   };
   setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FormEmailVerification({
   registrationResult: { message, token },
   setIsOpen,
}: Props) {
   const { mutateAsync, isPending } = useVerify();
   const form = useAppForm({
      defaultValues: {
         code: "",
      },
      validators: {
         onChange: emailVerificationSchema,
      },
      async onSubmit({ value: { code } }) {
         const id = toast.loading("Submitting your data...");
         try {
            const data = await mutateAsync({
               code,
               token,
            });
            if (data) {
               setAccessToken(data.token);
            }
            toast.success("Email verification is successful", { id });
            setIsOpen(false);
         } catch (err) {
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
            className="space-y-4"
         >
            <DialogTitle className="font-bold text-4xl">Account Verification</DialogTitle>
            <Description>Verify your new account</Description>
            <div className="text-center py-4" role="alert">
               {message}
            </div>
            <div className="w-full py-8">
               <form.AppField name="code">
                  {(field) => <field.AuthTextField type="text" placeholder="Code" />}
               </form.AppField>
               <form.AppForm>
                  <form.AuthSubscribeBtn label="Verify My Account" />
               </form.AppForm>
            </div>
         </form>
      </fieldset>
   );
}
