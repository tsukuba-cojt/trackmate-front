"use client"

import Header from "@/components/_Header";
import ErrorPage from "@/components/errorPage";
import LoanHistory from "@/components/loanDetail";
import LoanDetail from "@/components/loanDetail";
import { PopUpComponent } from "@/components/popUpComponent";
import Switcher from "@/components/switcher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useDialog from "@/hooks/useDialog";
import useErrorPage from "@/hooks/useErrorPage";
import useLoans from "@/hooks/useLoans";
import { cn } from "@/lib/utils";
import { HttpError } from "@/uitls/HttpError";
import { useRouter } from "next/navigation";

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

const deleteLoan = async (personName: string, isDebt: boolean) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "loan"

  console.log(personName);
  console.log(isDebt);

  const res = await fetch(url, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({person_name: personName, is_debt: isDebt})
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    console.log(res.status);
    throw new HttpError(errorData.message, res.status);
  }
}

export default function Display() {
  const router = useRouter();

  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  const {loans, setLoans, error, isLoading, mutateLoans} = useLoans();
  if (error) {
      if (error instanceof HttpError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
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

  const handleDeleteButtonClick = async (e: React.MouseEvent, personName: string, isDebt: boolean) => {
    e.stopPropagation();
    try {
      await deleteLoan(personName, isDebt);
      mutateLoans();
      openDialog("精算完了しました", "/check_mark.svg");
    }
    catch(error: any) {
      if (error instanceof HttpError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
        }
        else if (error.statusCode === 404) {
          openDialog("貸し借りの記録が見つかりませんでした", "/注意のマーク.svg")
        }
        else if (error.statusCode === 400 || error.statusCode === 500) {
          showErrorPage(500, "もう一度接続してください");
        } 
        else {
          showErrorPage(500, "もう一度接続してください");
        }
      } else {
        showErrorPage(500, "もう一度接続してください");
      }
    }
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

  if (!isLoading && !error) return (
    <>
      <Header title="貸し借り"></Header>
      <div className="flex flex-col w-full items-center justify-center">
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

                  <LoanHistory loan={loan} onClick={handleDeleteButtonClick}></LoanHistory>
                </CardContent>          
              </Card>
            );
          })}
        </div>
        
        <PopUpComponent {...dialogProps}/>
      </div>
    </>
  );
}