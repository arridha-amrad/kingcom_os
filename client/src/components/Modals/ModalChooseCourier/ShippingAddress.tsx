import CheckoutSelect from '@/components/Forms/checkout/Select';
import type { IdWithName } from '@/hooks/useShipping';
import { Field, Label, Textarea } from '@headlessui/react';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  provinces: IdWithName[];
  cities?: IdWithName[];
  districts?: IdWithName[];
  setProvinceId: Dispatch<React.SetStateAction<number | null>>;
  setCityId: Dispatch<React.SetStateAction<number | null>>;
  setDistrictId: Dispatch<React.SetStateAction<number | null>>;
  findServices: () => Promise<void>;
  isPending: boolean;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
}

const ShippingAddress = ({
  provinces,
  cities,
  districts,
  setProvinceId,
  setCityId,
  setDistrictId,
  findServices,
  isPending,
  address,
  setAddress,
}: Props) => {
  return (
    <div className="w-full space-y-2">
      <CheckoutSelect
        setId={setProvinceId}
        label="Province"
        options={provinces}
      />
      <CheckoutSelect setId={setCityId} label="City" options={cities} />
      <CheckoutSelect
        setId={setDistrictId}
        label="District"
        options={districts}
      />
      <Field>
        <Label className="text-sm/6 font-medium text-foreground">
          Home Address
        </Label>
        <Textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Additional address details"
          className="w-full h-24 mt-1 resize-none bg-foreground/5 text-foreground rounded-lg p-2 outline-none focus:ring focus:ring-foreground/20 transition-colors duration-200"
        />
      </Field>
      <div className="my-4">
        <button
          onClick={findServices}
          disabled={isPending}
          className="bg-foreground disabled:brightness-75 text-background w-full rounded-2xl py-2 font-medium hover:bg-foreground/90 transition-colors ease-in duration-100"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
export default ShippingAddress;
