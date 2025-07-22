import { useFieldContext, useFormContext } from '@/hooks/useAppForm';
import { cn } from '@/utils';
import { useStore } from '@tanstack/react-form';
import { LockKeyhole, Mail, QrCode, User, UserCircle } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

export const AuthSubscribeBtn = ({ label }: { label: string }) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 flex items-center justify-center gap-2 py-2 font-semibold bg-foreground w-full disabled:brightness-75 text-background rounded-full"
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
};

const ErrorMessages = ({
  errors,
}: {
  errors: Array<string | { message: string }>;
}) => {
  const error =
    errors[0] &&
    (typeof errors[0] === 'string' ? errors[0] : errors[0].message);

  return <div className="text-sm text-red-400 pl-4 mt-1">{error}</div>;
};

export const AuthTextField = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn(
            'bg-foreground/10 focus:ring-2 pl-12 pr-4 ring-foreground/50 outline-0 w-full h-[3rem] rounded-full',
          )}
          {...props}
        />
        <div className="absolute top-1/2 -translate-y-1/2 left-3 aspect-square">
          {field.name?.includes('email') && (
            <Mail className="stroke-foreground/20" />
          )}
          {field.name?.includes('password') && (
            <LockKeyhole className="stroke-foreground/20" />
          )}
          {field.name === 'username' && (
            <UserCircle className="stroke-foreground/20" />
          )}
          {(field.name === 'name' || field.name === 'identity') && (
            <User className="stroke-foreground/20" />
          )}
          {field.name === 'code' && <QrCode className="stroke-foreground/20" />}
        </div>
      </div>
      {field.state.meta.isDirty && <ErrorMessages errors={errors} />}
    </div>
  );
};
