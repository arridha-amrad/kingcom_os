import type { Courier } from '@/hooks/useShipping';
import { formatToIdr } from '@/utils';
import { Radio, RadioGroup } from '@headlessui/react';

interface Props {
  costs: Courier[];
  courier: Courier | null;
  setCourier: (courier: Courier) => void;
  selectService: () => void;
}

const AvailableCouriers = ({
  costs,
  courier,
  setCourier,
  selectService,
}: Props) => {
  return (
    <div className="mt-4">
      <div className="text-sm font-medium mb-2">Available services</div>
      <RadioGroup
        value={courier}
        onChange={setCourier}
        aria-label="Courier"
        className="space-y-2"
      >
        {costs.map((cost, i) => (
          <Radio
            key={i}
            value={cost}
            className="flex items-end justify-between hover:bg-foreground/5 transition-colors ease-in duration-100 px-4 py-2 rounded-lg cursor-pointer data-checked:bg-white/10"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{cost.name}</span>
              <span className="text-sm">{cost.service}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm italic font-bold">{cost.etd}</span>
              <span className="text-sm">{formatToIdr(cost.cost)}</span>
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <div onClick={selectService} className="my-4">
        <button className="bg-foreground disabled:brightness-75 text-background w-full rounded-2xl py-2 font-medium hover:bg-foreground/90 transition-colors ease-in duration-100">
          Continue
        </button>
      </div>
    </div>
  );
};

export default AvailableCouriers;
