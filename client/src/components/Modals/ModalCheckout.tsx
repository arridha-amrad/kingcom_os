import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from '@headlessui/react';
import { ArrowRightIcon, X } from 'lucide-react';
import { useState } from 'react';
import {
  useDistrictCalculateCost,
  useGetCities,
  useGetDistrict,
  useGetProvince,
} from '@/hooks/useShipping';
import CheckoutSelect from '../Forms/checkout/Select';

export default function ModalCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetProvince();

  const originId = 1334;
  const weight = 1000;

  const [provinceId, setProvinceId] = useState<null | number>(null);
  const { data: cities } = useGetCities(provinceId);
  const [cityId, setCityId] = useState<null | number>(null);
  const { data: districts } = useGetDistrict(cityId);
  console.log({ districts });

  const [districtId, setDistrictId] = useState<null | number>(null);

  const { data: cost } = useDistrictCalculateCost(originId, weight, districtId);

  if (!data) return null;

  console.log({ cost });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="h-15 rounded-full w-full flex items-center justify-center gap-4 bg-foreground font-medium text-background"
      >
        <span className="font-medium">Go to Checkout</span>
        <ArrowRightIcon />
      </button>
      <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-background/70 backdrop-blur duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="max-w-sm w-full border border-foreground/20 relative z-50 shadow-2xl bg-background backdrop-blur-2xl rounded-2xl px-8 py-12 duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <div className="absolute inset-0 blur-3xl -z-50 bg-foreground/10" />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-[4%] right-[5%]"
            >
              <X className="stroke-foreground/50 hover:stroke-foreground transition-colors ease-in duration-100" />
            </button>
            <DialogTitle className="font-bold text-4xl">
              Shipping Address
            </DialogTitle>
            <Description className="mt-2 mb-8">
              Please complete your shipping address
            </Description>
            <div className="w-full space-y-2">
              <CheckoutSelect
                setId={setProvinceId}
                label="Province"
                options={data}
              />
              <CheckoutSelect setId={setCityId} label="City" options={cities} />
              <CheckoutSelect
                setId={setDistrictId}
                label="District"
                options={districts}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
