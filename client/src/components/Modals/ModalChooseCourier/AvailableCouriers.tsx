import { useOrder } from '@/components/Providers/OrderProvider';
import type { Courier } from '@/hooks/useShipping';
import { formatToIdr } from '@/utils';
import { Radio, RadioGroup } from '@headlessui/react';
import { useState } from 'react';

interface Props {
  closeModal: VoidFunction;
}

const AvailableCouriers = ({ closeModal }: Props) => {
  const [myCourier, setMyCourier] = useState<Courier | null>(null);
  const { setCourier, availableCouriers } = useOrder();
  const chooseCourier = () => {
    closeModal();
    setCourier(myCourier);
  };
  return (
    <div className="mt-4">
      <div className="text-sm font-medium mb-2">Available services</div>
      <RadioGroup
        value={myCourier}
        onChange={setMyCourier}
        aria-label="Courier"
        className="space-y-2"
      >
        {availableCouriers.map((ac, i) => (
          <Radio
            key={i}
            value={ac}
            className="flex items-end justify-between hover:bg-foreground/5 transition-colors ease-in duration-100 px-4 py-2 rounded-lg cursor-pointer data-checked:bg-white/10"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{ac.name}</span>
              <span className="text-sm">{ac.service}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm italic font-bold">{ac.etd}</span>
              <span className="text-sm">{formatToIdr(ac.cost)}</span>
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <div onClick={chooseCourier} className="my-4">
        <button className="bg-foreground disabled:brightness-75 text-background w-full rounded-2xl py-2 font-medium hover:bg-foreground/90 transition-colors ease-in duration-100">
          Pick Courier
        </button>
      </div>
    </div>
  );
};

export default AvailableCouriers;
