"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function Display() {
  type LoanObject = {
    name: string, 
    sumLoan: number, 
    key: number
  }

  const [loans, setLoans] = useState<LoanObject[]>([
    {name: "やすの", sumLoan: 1500, key: 1}, 
    {name: "Astalum", sumLoan: 1300, key: 2}, 
    {name: "こまつさん", sumLoan: 20300, key: 3}
  ])

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-4">
        {loans.map((loan) => {
          return (
            <Card className="w-3/4 rounded-3xl" key={loan.key}>
              <CardContent>
                <div>{loan.name}</div>
                <div className="flex justify-end text-4xl">¥ {loan.sumLoan.toLocaleString()}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}