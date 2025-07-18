"use client"

import LoanDetail from "@/components/loanDetail";
import Switcher from "@/components/switcher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

export default function Display() {
  const [loans, setLoans] = useState<LoanObject[]>([
    {
      name: "やすの", 
      sumAmount: 1500, 
      isDebt: true,
      isOpen: true,
      details: [
        {date: new Date("2025/04/17"), amount: 1000, key: 1}, 
        {date: new Date("2025/04/20"), amount: 500, key: 2} 
      ],
      key: 1, 
    }, 
    {
      name: "Astalum", 
      sumAmount: 1300, 
      isDebt: false,
      isOpen: false,
      details: [
        {date: new Date("2025/04/17"), amount: 700, key: 1}, 
        {date: new Date("2025/04/20"), amount: 600, key: 2}, 
      ],
      key: 2, 
    }, 
    {
      name: "こまつさん", 
      sumAmount: 20300, 
      isDebt: false,
      isOpen: false,
      details: [
        {date: new Date("2025/04/17"), amount: 10000, key: 1}, 
        {date: new Date("2025/04/20"), amount: 10000, key: 2}, 
        {date: new Date("2025/04/021"), amount: 300, key: 3}, 
      ],
      key: 3, 
    }
  ])

  const handleCardClick = (clickedKey: number) => {
    setLoans((prevLoans: LoanObject[]) => {
      return prevLoans.map((prevLoan: LoanObject) => {
        if (prevLoan.key === clickedKey) {
          console.log(!prevLoan.isOpen);
          return {...prevLoan, isOpen: !prevLoan.isOpen};
        } else {
          return prevLoan;
        }
      })
    })
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
                <div className="font-bold">{loan.name}</div>

                <div className={cn("flex flex-row w-full items-center justify-between", loan.isOpen && "mb-4")}>
                  <p className={loan.isDebt? "pl-2 font-bold text-2xl text-theme-200": "pl-2 font-bold text-2xl text-red-400"}>
                    {loan.isDebt? '貸し': '借り'}
                  </p>
                  <p className=" text-3xl pr-2">¥ {loan.sumAmount.toLocaleString()}</p>
                </div>

                <LoanDetail loan={loan} className=""></LoanDetail>
              </CardContent>          
            </Card>
          );
        })}
      </div>

    </div>
  );
}