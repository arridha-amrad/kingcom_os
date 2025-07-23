import { Minus, Plus } from 'lucide-react';
import { SlidingNumber } from '../motion-primitives/slide-number';
import { cn } from '@/utils';

type Props = {
  onIncrease: VoidFunction;
  value: number;
  onDecrease: VoidFunction;
};

export default function ButtonQuantity({
  onDecrease,
  onIncrease,
  value,
}: Props) {
  return (
    <div className="sm:h-12 h-10 flex w-max items-center rounded-full bg-foreground">
      <button
        onClick={onDecrease}
        className="size-full flex items-center justify-center"
      >
        <Minus
          className={cn(
            value === 1 ? 'stroke-background/20' : 'stroke-background',
          )}
        />
      </button>
      <div className="w-[100px] flex items-center justify-center text-background font-medium">
        <SlidingNumber value={value} />
      </div>

      <button
        onClick={onIncrease}
        className="size-full flex items-center justify-center"
      >
        <Plus className="stroke-background" />
      </button>
    </div>
  );
}
