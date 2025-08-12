import CheckoutSelect from '@/components/Forms/checkout/Select';
import { useOrder } from '@/components/Providers/OrderProvider';
import {
  useFindServices,
  useGetCities,
  useGetDistricts,
  useGetProvince,
  type IdWithName,
} from '@/hooks/useShipping';
import { Field, Label, Textarea } from '@headlessui/react';
import { useState } from 'react';

const ShippingAddress = () => {
  const [province, setProvince] = useState<null | IdWithName>(null);
  const [city, setCity] = useState<null | IdWithName>(null);

  const { data: provinces } = useGetProvince();
  const { data: cities } = useGetCities(province?.id);
  const { data: districts } = useGetDistricts(city?.id);

  const { setAddress, setDistrict, district, findAvailableCouriers } =
    useOrder();
  const { isPending } = useFindServices();

  const [addr, setAddr] = useState('');

  const handleContinue = async () => {
    setAddress(`${addr}, ${district?.name}, ${city?.name}, ${province?.name}`);
    await findAvailableCouriers();
  };

  return (
    <div className="w-full space-y-2">
      <CheckoutSelect
        setData={setProvince}
        label="Province"
        options={provinces}
      />
      <CheckoutSelect setData={setCity} label="City" options={cities} />
      <CheckoutSelect
        setData={setDistrict}
        label="District"
        options={districts}
      />
      <Field>
        <Label className="text-sm/6 font-medium text-foreground">
          Home Address
        </Label>
        <Textarea
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          placeholder="Additional address details"
          className="w-full h-24 mt-1 resize-none bg-foreground/5 text-foreground rounded-lg p-2 outline-none focus:ring focus:ring-foreground/20 transition-colors duration-200"
        />
      </Field>
      <div className="my-4">
        <button
          onClick={handleContinue}
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
