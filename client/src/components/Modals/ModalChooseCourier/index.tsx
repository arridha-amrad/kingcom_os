import { useGetAuth } from '@/hooks/auth/useGetAuth';
import { useGetCart } from '@/hooks/product/useGetCart';
import {
  useFindServices,
  useGetCities,
  useGetDistricts,
  useGetProvince,
  type Courier,
} from '@/hooks/useShipping';
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Truck, X } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import toast from 'react-hot-toast';
import AvailableCouriers from './AvailableCouriers';
import ShippingAddress from './ShippingAddress';

interface Props {
  setDeliveryFee: (fee: number) => void;
  setAddress: Dispatch<SetStateAction<string>>;
  setCourier: Dispatch<SetStateAction<Courier | null>>;
  courier: Courier | null;
}

export default function ModalChooseCourier({
  setDeliveryFee,
  setAddress,
  setCourier,
  courier,
}: Props) {
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
  const { mutateAsync, isPending } = useFindServices();

  const [services, setServices] = useState<Courier[]>([]);

  const findServices = async () => {
    if (!districtId || !weight || !originId) return;
    const id = toast.loading('Finding available courier services...', {
      removeDelay: 500,
    });
    try {
      const result = await mutateAsync({
        originId,
        destinationId: districtId,
        weight,
      });
      setServices(result);
    } catch (error) {
      console.error('Failed to fetch courier services:', error);
      toast.error('Failed to fetch courier services', { id, removeDelay: 500 });
    } finally {
      toast.dismiss(id);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setProvinceId(null);
    setCityId(null);
    setDistrictId(null);
    setCourier(null);
  };

  const selectService = () => {
    closeModal();
  };

  if (!provinces) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-foreground text-background font-medium rounded-2xl px-4 py-2 flex items-center gap-2"
      >
        Choose Courier
        <Truck className="size-5" />
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
              Choose Courier
            </DialogTitle>
            <Description className="mt-2 mb-8">
              Select your shipping address and courier service.
            </Description>
            {services.length > 0 ? (
              <AvailableCouriers
                costs={services}
                courier={courier}
                setCourier={setCourier}
                selectService={selectService}
              />
            ) : (
              <ShippingAddress
                provinces={provinces}
                cities={cities}
                districts={districts}
                setProvinceId={setProvinceId}
                setCityId={setCityId}
                setDistrictId={setDistrictId}
                findServices={findServices}
                isPending={isPending}
                address={address}
                setAddress={setAddress}
              />
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
