"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import {LoanDetail, ClientLoanObject} from "../../app/loan/display/page"

type Props = {
  loan: ClientLoanObject, 
  className?: string, 
  onClick: (e: React.MouseEvent, personName: string, isDebt: boolean) => void, 
}

export default function LoanHistory({loan, className, onClick}: Props) {
  const buttonStyle: string = "border-black font-bold border-1 px-6 py-2 text-xl mt-4";

  return (
    <div className={cn(`overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center w-full ${loan.isOpen ? 'max-h-screen' : 'max-h-0'}`, className)}>
      <div className="flex flex-col items-center gap-2 w-full">
        {loan.history.map((detail: LoanDetail) => {
           const dateToFormat = typeof detail.date === 'string'
                           ? new Date(detail.date)
                           : detail.date;
          return (
            <Card
            className={`rounded-3x py-2 w-full ${loan.is_debt? "bg-theme-100": "bg-red-200"}`}
            key={detail.key}
            >
              <CardContent>
                <p className="font-bold">
                  {dateToFormat.toLocaleDateString(
                    'ja-JP', 
                    {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }
                  ).replace(/\//g, '/')}
                </p>
                <p className="w-full text-right text-3xl">
                  ¥ {detail.amount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button variant={"outline"} className={buttonStyle} onClick={(e) => onClick(e, loan.person_name, loan.is_debt)}>清算完了</Button>
    </div>
  );
}