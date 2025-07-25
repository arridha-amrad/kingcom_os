import { Field, Label, Select } from '@headlessui/react';
import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';

interface Props {
  options?: {
    name: string;
    id: number;
  }[];
  label: string;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function CheckoutSelect({ label, options, setId }: Props) {
  return (
    <div className="w-full">
      <Field>
        <Label className="text-sm/6 font-medium text-foreground">{label}</Label>
        <div className="relative">
          <Select
            onChange={(e) => setId(Number(e.target.value))}
            className={clsx(
              'mt-1 block w-full appearance-none rounded-lg border-none bg-foreground/5 px-3 py-1.5 text-sm/6 text-foreground',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-foreground/25',
              // Make the text of each option black on Windows
              '*:text-background',
            )}
          >
            {options?.map((o, i) => (
              <option key={i} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-foreground/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
}
