"use client"

import ErrorPage from "@/components/errorPage";
import LoanHistory from "@/components/loanDetail";
import LoanDetail from "@/components/loanDetail";
import Switcher from "@/components/switcher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useDialog from "@/hooks/useDialog";
import useErrorPage from "@/hooks/useErrorPage";
import useLoans from "@/hooks/useLoans";
import { cn } from "@/lib/utils";
import { HttpError } from "@/uitls/HttpError";
import { useRouter } from "next/navigation";

export interface ApiDetail {
  date: Date, 
  amount: number, 
}

export interface LoanDetail extends ApiDetail {
  key: string
}

export interface ApiLoanObject {
  person_name: string;
  sum_amount: number;
  is_debt: boolean;
  history: LoanDetail[];
}

export interface ClientLoanObject extends ApiLoanObject{
    isOpen: boolean,
    key: string, 
}

export default function Display() {
  const router = useRouter();

  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  const {loans, setLoans, error, isLoading} = useLoans();
  if (error) {
      if (error instanceof HttpError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/");
        }
        if (error.statusCode === 500) {
          showErrorPage(error.statusCode, "もう一度接続してください");
        }
      }
    }

  const handleCardClick = (clickedKey: string) => {
    setLoans((prevLoans: ClientLoanObject[]) => {
      return prevLoans.map((prevLoan: ClientLoanObject) => {
        if (prevLoan.key === clickedKey) {
          console.log(!prevLoan.isOpen);
          return {...prevLoan, isOpen: !prevLoan.isOpen};
        } else {
          return prevLoan;
        }
      })
    })
  }

  if (displayErrorPage) {
      return (
        <ErrorPage
        statusCode={displayErrorPage.statusCode} 
        errorMessage={displayErrorPage.message}
        >
        </ErrorPage>
      )
    }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>

      <Switcher
      leftText="表示"
      leftLink="/loan/display"
      rightText="入力"
      rightLink="/loan/input"
      focus="left"
      className="my-10"
      ></Switcher>

      <div className="flex w-full flex-col justify-center items-center gap-4">
        {loans.map((loan) => {
          // 合計金額を表示
          return (
            <Card 
              className="w-4/5 rounded-3xl py-6"
              key={loan.key}
              onClick={() => handleCardClick(loan.key)}
            >
              <CardContent>
                <div className="font-bold text-xl">{loan.person_name}</div>

                <div className={cn("flex flex-row w-full items-center justify-between", loan.isOpen && "mb-4")}>
                  <p className={loan.is_debt? "pl-2 font-bold text-2xl text-theme-200": "pl-2 font-bold text-2xl text-red-400"}>
                    {loan.is_debt? '貸し': '借り'}
                  </p>
                  <p className=" text-3xl pr-2">¥ {loan.sum_amount.toLocaleString()}</p>
                </div>

                <LoanHistory loan={loan} className=""></LoanHistory>
              </CardContent>          
            </Card>
          );
        })}
      </div>

    </div>
  );
}