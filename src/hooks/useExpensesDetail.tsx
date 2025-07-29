import fetcher from "@/uitls/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { v4 as uuidv4 } from 'uuid';

export type ApiExpenseDetail = {
  expense_id: string, 
  expense_amount: number, 
  category_name: string
}

export type ExpenseDetail = {
  id: string, 
  expenseAmount: number, 
  expenseCategoryName: string
}

export default function useExpensesDetail(date: string | undefined) {
  console.log("called", date);

  const { data, error, isLoading, mutate } = useSWR<ApiExpenseDetail[]>(`${process.env.NEXT_PUBLIC_BASE_API_URL}expenses?date=${date}`, fetcher);

  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetail[]>([])

  useEffect(() => {
    if (data && data.data) {
      const newExpenseDetail = data.data.map((apiExpenseDetail: ApiExpenseDetail) => {
        return (
          {
            id: apiExpenseDetail.expense_id, 
            expenseAmount: apiExpenseDetail.expense_amount, 
            expenseCategoryName: apiExpenseDetail.category_name
          }
        )
      })
      setExpenseDetails(newExpenseDetail);
    } if (!data) {
      setExpenseDetails([]);
    }
  }, [data, error])

  return {
    expenseDetails, 
    setExpenseDetails, 
    error,
    isLoading, 
    mutateExpenseDetails: mutate
  }
}