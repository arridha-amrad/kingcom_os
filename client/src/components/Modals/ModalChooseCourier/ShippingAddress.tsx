import CheckoutSelect from '@/components/Forms/checkout/Select';
import { useOrder } from '@/components/Providers/OrderProvider';
import {
  useFindServices,
  useGetCities,
  useGetDistricts,
  useGetProvince,
} from '@/hooks/useShipping';
import { Field, Label, Textarea } from '@headlessui/react';
import { useState } from 'react';

const ShippingAddress = () => {
  const [provinceId, setProvinceId] = useState<null | number>(null);
  const [cityId, setCityId] = useState<null | number>(null);

  const { data: provinces } = useGetProvince();
  const { data: cities } = useGetCities(provinceId);
  const { data: districts } = useGetDistricts(cityId);

  const { setAddress, address, setBuyerDistrictId, findAvailableCouriers } =
    useOrder();
  const { isPending } = useFindServices();

  return (
    <div className="w-full space-y-2">
      <CheckoutSelect
        setId={setProvinceId}
        label="Province"
        options={provinces}
      />
      <CheckoutSelect setId={setCityId} label="City" options={cities} />
      <CheckoutSelect
        setId={setBuyerDistrictId}
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
          onClick={findAvailableCouriers}
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
