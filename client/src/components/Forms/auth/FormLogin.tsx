import { Description, DialogTitle } from "@headlessui/react";
import { type Dispatch, type SetStateAction } from "react";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAppForm } from "@/hooks/useAppForm";
import { setAccessToken } from "@/lib/axiosInterceptor";
import { loginSchema } from "@/schemas/auth";
import { Link } from "@tanstack/react-router";
import toast from "react-hot-toast";

interface Props {
   setIsOpen: Dispatch<SetStateAction<boolean>>;
   setIsLogin: Dispatch<SetStateAction<boolean>>;
}

export default function FormLogin({ setIsOpen, setIsLogin }: Props) {
   const { mutateAsync, isPending } = useLogin();
   const form = useAppForm({
      defaultValues: {
         identity: "",
         password: "",
      },
      validators: {
         onChange: loginSchema,
      },
      async onSubmit({ value: { identity, password } }) {
         try {
            const data = await mutateAsync({
               identity,
               password,
            });
            if (data) {
               setAccessToken(data.token);
            }
            setIsOpen(false);
         } catch (err) {
            if (err instanceof Error) {
               console.log("error login : ", err.message);
               toast.error(err.message);
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
            <DialogTitle className="font-bold text-4xl">Login</DialogTitle>
            <Description>Login into your account</Description>
            <div className="w-full space-y-4 py-8">
               <form.AppField name="identity">
                  {(field) => <field.AuthTextField type="text" placeholder="Username or email" />}
               </form.AppField>
               <form.AppField name="password">
                  {(field) => <field.AuthTextField type="password" placeholder="Password" />}
               </form.AppField>
               <form.AppForm>
                  <form.AuthSubscribeBtn label="Login" />
               </form.AppForm>
            </div>
            <div className="text-center">
               <Link className="text-foreground/50 hover:text-foreground" to="/">
                  Forgot Password
               </Link>
            </div>
            <div className="text-center">
               <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="underline underline-offset-4"
               >
                  Sign Up
               </button>
            </div>
         </form>
      </fieldset>
   );
}
