import { useLogout } from '@/hooks/auth/useLogout';
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { X } from 'lucide-react';
import { type Dispatch, type SetStateAction } from 'react';
import Spinner from '../Spinner';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ModalLogout({ isOpen, setIsOpen }: Props) {
  const { mutateAsync, isPending } = useLogout();
  const logout = async () => {
    try {
      await mutateAsync();
      toast.success('You have logged out');
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast.error(err.message);
      }
    }
  };
  return (
    <>
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
            <DialogTitle className="font-bold text-4xl">Logout</DialogTitle>
            <Description as="div" className="my-8 text-center">
              <p>This action will clear out your session.</p>
              <p>Are you sure to continue?</p>
            </Description>
            <button
              className="w-full flex items-center justify-center bg-foreground py-2 rounded-xl text-background font-semibold"
              onClick={logout}
            >
              {true ? <Spinner /> : 'Yes, Log me out'}
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
