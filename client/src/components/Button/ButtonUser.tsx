import { useGetAuth } from '@/hooks/auth/useGetAuth';
import UserDropdown from '../Dropdowns/UserDropDown';
import ModalLoginOrSignup from '../Modals/ModalLoginOrSignup';
import Spinner from '../Spinner';

export default function ButtonUser() {
  const { data, isLoading } = useGetAuth();
  if (isLoading) {
    return (
      <button className="fill-foreground">
        <Spinner />
      </button>
    );
  }
  if (!data) {
    return <ModalLoginOrSignup />;
  } else {
    return <UserDropdown />;
  }
}
