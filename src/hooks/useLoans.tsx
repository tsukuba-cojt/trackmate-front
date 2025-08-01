import fetcher from "@/uitls/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { v4 as uuidv4 } from 'uuid';

export type ApiDetail = {
  date: Date, 
  amount: number, 
}

export type LoanDetail = ApiDetail & {
  key: string
}

export type ApiLoanObject = {
  person_name: string;
  sum_amount: number;
  is_debt: boolean;
  history: LoanDetail[];
}

export type ClientLoanObject = ApiLoanObject & {
    isOpen: boolean,
    key: string, 
}

export default function useLoans() {
  const { data, error, isLoading, mutate } = useSWR(process.env.NEXT_PUBLIC_BASE_API_URL + 'loan', fetcher);

  const [loans, setLoans] = useState<ClientLoanObject[]>([])

  useEffect(() => {
    if (data && data.data) {
      console.log(data.data);
      const newLoans: ClientLoanObject[] = data.data.map((apiLoan: ApiLoanObject) => {
        const newLonasHistory = apiLoan.history.map((detail: ApiDetail) => {
          return ({
            ...detail,
            key: uuidv4()
          }
          );
        });
        return {
          ...apiLoan,
          history: newLonasHistory, 
          key: uuidv4(), 
          isOpen: false
        }
      })
      setLoans(newLoans);
    }
  }, [data, error])

  return {
    loans, 
    setLoans, 
    error,
    isLoading, 
    mutateLoans: mutate
  }
}