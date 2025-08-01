import fetcher from "@/uitls/fetcher";
import { HttpError } from "@/uitls/HttpError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

type ApiSummary = {
    expense_sum: number,
    budget: number,
    remaining_budget: number,
    debt_sum: number,
    loan_sum: number
}

type Summary = {
    expense_sum: number,
    budget: number,
    remaining_budget: number,
    debt_sum: number,
    loan_sum: number 
}

export default function useCategory() {
const [summaries, setSummaries] = useState<Summary[]>([]);
const { data, error, isLoading, mutate } = useSWR(process.env.NEXT_PUBLIC_BASE_API_URL + "expenses", fetcher);

useEffect(() => {
    if (data && data.data) {
    console.log(data.data);
    const newSummaries = data.data.map((responseSummaryItem: ApiSummary) => {
        return (
        {
            expense_sum: responseSummaryItem.expense_sum,
            budget: responseSummaryItem.budget,
            remaining_budget: responseSummaryItem.remaining_budget,
            debt_sum: responseSummaryItem.debt_sum,
            loan_sum: responseSummaryItem.loan_sum
        }
        )
    });
    setSummaries(newSummaries);
    }
}, [data, error])

return summaries;
}
