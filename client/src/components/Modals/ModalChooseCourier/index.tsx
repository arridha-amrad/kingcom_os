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

  const openModal = () => {
    setIsOpen(true);
    setCourier(null);
    setBuyerDistrictId(null);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="
          flex
          px-4 py-2
          text-background font-medium
          bg-foreground
          rounded-2xl
          items-center gap-2
        "
      >
        Choose Courier
        <Truck
          className="
            size-5
          "
        />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => {}}
        className="
          z-50
          relative
        "
      >
        <DialogBackdrop
          transition
          className="
            bg-background/70
            fixed inset-0 backdrop-blur duration-300 ease-out data-closed:opacity-0
          "
        />
        <div
          className="
            flex
            w-screen
            p-4
            fixed inset-0 items-center justify-center
          "
        >
          <DialogPanel
            transition
            className="
              z-50
              max-w-sm w-full
              px-8 py-12
              bg-background
              border border-foreground/20 rounded-2xl
              shadow-2xl
              relative backdrop-blur-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0
            "
          >
            <div
              className="
                bg-foreground/10
                absolute inset-0 blur-3xl -z-50
              "
            />
            <button
              onClick={closeModal}
              className="
                absolute top-[4%] right-[5%]
              "
            >
              <X
                className="
                  transition-colors
                  stroke-foreground/50 hover:stroke-foreground ease-in duration-100
                "
              />
            </button>
            <DialogTitle
              className="
                font-bold text-4xl
              "
            >
              Choose Courier
            </DialogTitle>
            <Description
              className="
                mt-2 mb-8
              "
            >
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
