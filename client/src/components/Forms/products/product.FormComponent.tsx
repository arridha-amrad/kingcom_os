import { useFieldContext, useFormContext } from "@/hooks/useAppForm";
import { useStore } from "@tanstack/react-form";
import { DollarSign } from "lucide-react";
import { useId, useRef } from "react";

const ErrorMessage = ({ errors }: { errors: Array<string | { message: string }> }) => {
   const error = errors[0] && (typeof errors[0] === "string" ? errors[0] : errors[0].message);
   return <div className="text-red-400 text-sm ml-4">{error}</div>;
};

export const ProductSubmitButton = () => {
   const form = useFormContext();
   return (
      <form.Subscribe selector={(state) => state.isSubmitting}>
         {(isSubmitting) => (
            <button
               type="submit"
               disabled={isSubmitting}
               className="py-4 px-8 disabled:bg-foreground/50 disabled:cursor-default w-fit bg-foreground text-background font-semibold rounded-full"
            >
               Add Product
            </button>
         )}
      </form.Subscribe>
   );
};

export const ProductTextArea = ({ label }: { label: string }) => {
   const id = useId();
   const field = useFieldContext<string>();
   const errors = useStore(field.store, (state) => state.meta.errors);
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   const handleInput = () => {
      const textarea = textAreaRef.current;
      if (textarea) {
         textarea.style.height = "auto"; // reset height
         textarea.style.height = textarea.scrollHeight + "px"; // set new height
      }
   };
   return (
      <div className="w-full">
         <label className="mx-4 space-y-2 mt-4" htmlFor={id}>
            {label}
         </label>
         <textarea
            id={id}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            onInput={handleInput}
            ref={textAreaRef}
            className="w-full mt-2 resize-none p-4 rounded-xl focus:bg-foreground/5 outline-none"
            rows={1}
            placeholder={`${label}...`}
         ></textarea>
         {field.state.meta.isDirty && <ErrorMessage errors={errors} />}
      </div>
   );
};

export const ProductInputNumber = ({ label }: { label: string }) => {
   const id = useId();
   const field = useFieldContext<string>();
   const errors = useStore(field.store, (state) => state.meta.errors);
   return (
      <div className="w-full space-y-2 mt-4">
         <label className="mx-4 block" htmlFor={id}>
            {label}
         </label>
         <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-2">
               <DollarSign className="stroke-foreground/50" />
            </div>
            <input
               id={id}
               value={field.state.value}
               onBlur={field.handleBlur}
               onChange={(e) => field.handleChange(e.target.value)}
               placeholder={`${label}...`}
               type="number"
               className="py-4 pl-12 pr-4 w-full focus:bg-foreground/5 rounded-xl outline-none"
            />
         </div>
         {field.state.meta.isDirty && <ErrorMessage errors={errors} />}
      </div>
   );
};
