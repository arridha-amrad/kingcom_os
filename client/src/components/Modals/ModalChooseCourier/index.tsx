import { useOrder } from '@/components/Providers/OrderProvider';
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Truck, X } from 'lucide-react';
import { useState } from 'react';
import AvailableCouriers from './AvailableCouriers';
import ShippingAddress from './ShippingAddress';

export default function ModalChooseCourier({}) {
  const [isOpen, setIsOpen] = useState(false);

  const { setCourier, availableCouriers, setBuyerDistrictId } = useOrder();

  const closeModal = () => {
    setIsOpen(false);
    setCourier(null);
    setBuyerDistrictId(null);
  };

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
            {availableCouriers.length > 0 ? (
              <AvailableCouriers closeModal={closeModal} />
            ) : (
              <ShippingAddress />
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
