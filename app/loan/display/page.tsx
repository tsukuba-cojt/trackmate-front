"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";
import { useState } from "react";

type LoanObject = {
    name: string, 
    sumLoan: number, 
    isDebt: boolean, 
    key: number, 
}

export default function Display() {
  const [loans, setLoans] = useState<LoanObject[]>([
    {
      name: "やすの", 
      sumLoan: 1500, 
      isDebt: true,
      key: 1, 
    }, 
    {
      name: "Astalum", 
      sumLoan: 1300, 
      isDebt: false,
      key: 2, 
    }, 
    {
      name: "こまつさん", 
      sumLoan: 20300, 
      isDebt: false,
      key: 3, 
    }
  ])

  const handleCardClick = (clickedKey: number) => {
    
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>

      <div className="flex w-full flex-col justify-center items-center gap-4">
        {loans.map((loan) => {
          // 合計金額を表示
          return (
            <Card 
              className="w-3/4 rounded-3xl py-6"
              key={loan.key}
              onClick={() => handleCardClick(loan.key)}
            >
              <CardContent>
                <div className="font-bold">{loan.name}</div>
                <div className="flex flex-row w-full items-center justify-between">
                  <p className={loan.isDebt? "pl-2 font-bold text-2xl text-green-400": "pl-2 font-bold text-2xl text-red-400"}>
                    {loan.isDebt? '貸し': '借り'}
                  </p>
                  <p className=" text-4xl">¥ {loan.sumLoan.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}