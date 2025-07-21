import { useSignup } from "@/hooks/auth/useSignup";
import { useAppForm } from "@/hooks/useAppForm";
import { signupSchema } from "@/schemas/auth";
import { Description, DialogTitle } from "@headlessui/react";
import { type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";

interface Props {
   setIsLogin: Dispatch<SetStateAction<boolean>>;
   setRegistrationResult: Dispatch<
      SetStateAction<{
         message: string;
         token: string;
      }>
   >;
}

export default function FormSignup({ setIsLogin, setRegistrationResult }: Props) {
   const { isPending, mutateAsync } = useSignup();
   const form = useAppForm({
      defaultValues: {
         name: "",
         email: "",
         username: "",
         password: "",
      },
      validators: {
         onChange: signupSchema,
      },
      async onSubmit({ value }) {
         const id = toast.loading("Submitting your data...");
         try {
            const data = await mutateAsync(value);
            toast.success("Registration is successful", { id });
            if (data) {
               setRegistrationResult({
                  message: data.message,
                  token: data.token,
               });
            }
         } catch (err) {
            if (err instanceof Error) {
               console.log(err.message);
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
            <DialogTitle className="font-bold text-4xl">Sign Up</DialogTitle>
            <Description>Create a new account</Description>
            <div className="w-full space-y-4 py-8">
               <form.AppField name="name">
                  {(field) => <field.AuthTextField type="text" placeholder="Name" />}
               </form.AppField>
               <form.AppField name="email">
                  {(field) => <field.AuthTextField type="text" placeholder="Email Address" />}
               </form.AppField>
               <form.AppField name="username">
                  {(field) => <field.AuthTextField type="text" placeholder="Username" />}
               </form.AppField>
               <form.AppField name="password">
                  {(field) => <field.AuthTextField type="password" placeholder="Password" />}
               </form.AppField>
               <form.AppForm>
                  <form.AuthSubscribeBtn label="Sign up" />
               </form.AppForm>
            </div>
            <div className="text-center">
               <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="underline underline-offset-4"
               >
                  Login
               </button>
            </div>
         </form>
      </fieldset>
   );
}
