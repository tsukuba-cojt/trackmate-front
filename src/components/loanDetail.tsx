"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type LoanDetail = {
  date: Date, 
  amount: number, 
  key: number
}

type LoanObject = {
    name: string, 
    sumAmount: number, 
    isDebt: boolean, 
    isOpen: boolean,
    details: LoanDetail[],
    key: number, 
}

type Props = {
  loan: LoanObject, 
  className?: string
}

export default function LoanDetail({loan, className}: Props) {
  const buttonStyle: string = "border-black font-bold border-1 px-6 py-2 text-xl mt-4";

  const handleClick = () => {
    
  }

  return (
    <div className={cn(`overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center w-full ${loan.isOpen ? 'max-h-screen' : 'max-h-0'}`, className)}>
      <div className="flex flex-col items-center gap-2 w-full">
        {loan.details.map((detail: LoanDetail) => {
          return (
            <Card
            className={`rounded-3x py-2 w-full ${loan.isDebt? "bg-theme-100": "bg-red-200"}`}
            key={detail.key}
            >
              <CardContent>
                <p className="font-bold">
                  {detail.date.toLocaleDateString(
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

      <Button variant={"outline"} className={buttonStyle} onClick={() => handleClick()}>清算完了</Button>
    </div>
  );
}