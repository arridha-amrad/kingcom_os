import { useGetAuth } from '@/hooks/auth/useGetAuth';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import TransactionItem from './TransactionItem';

export default function TransactionList() {
  const { data: authUser } = useGetAuth();
  const { data: transactions, error, isError } = useGetTransactions(authUser);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError]);

  return transactions?.map((t) => <TransactionItem key={t.id} item={t} />);
}
