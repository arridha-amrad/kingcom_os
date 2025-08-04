import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
  RadioGroup,
  Radio,
} from '@headlessui/react';
import { ArrowRightIcon, X } from 'lucide-react';
import { useState } from 'react';
import {
  useGetCosts,
  useGetCities,
  useGetDistricts,
  useGetProvince,
  type Courier,
} from '@/hooks/useShipping';
import CheckoutSelect from '../Forms/checkout/Select';
import { useGetCart } from '@/hooks/product/useGetCart';
import { useGetAuth } from '@/hooks/auth/useGetAuth';

export default function ModalCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: authUser } = useGetAuth();
  const { data: cart } = useGetCart(authUser);

  const originId = 1334;

  const weight =
    cart?.reduce((acc, item) => acc + item.Product.weight * item.quantity, 0) ??
    0;

  const [provinceId, setProvinceId] = useState<null | number>(null);
  const [cityId, setCityId] = useState<null | number>(null);
  const [districtId, setDistrictId] = useState<null | number>(null);

  const { data: provinces } = useGetProvince();
  const { data: cities } = useGetCities(provinceId);
  const { data: districts } = useGetDistricts(cityId);
  const { data: costs, isFetching } = useGetCosts(originId, weight, districtId);

  const [courier, setCourier] = useState<null | Courier>(null);

  const closeModal = () => {
    setIsOpen(false);
    setProvinceId(null);
    setCityId(null);
    setDistrictId(null);
    setCourier(null);
  };

  if (!provinces) return null;

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
              onClick={closeModal}
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
                options={provinces}
              />
              <CheckoutSelect setId={setCityId} label="City" options={cities} />
              <CheckoutSelect
                setId={setDistrictId}
                label="District"
                options={districts}
              />
            </div>
            {isFetching && (
              <div className="animate-pulse mt-8 mb-2">
                Finding available service...
              </div>
            )}
            {costs && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">
                  Available services
                </div>
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
                        <span className="text-sm font-semibold">
                          {cost.name}
                        </span>
                        <span className="text-sm">{cost.service}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm italic font-bold">
                          {cost.etd}
                        </span>
                        <span className="text-sm">
                          {`Rp ${cost.cost.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`}
                        </span>
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            )}
            <div className="my-4">
              <button
                disabled={!courier}
                className="bg-foreground disabled:brightness-75 text-background w-full rounded-2xl py-2 font-medium hover:bg-foreground/90 transition-colors ease-in duration-100"
              >
                Continue
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
