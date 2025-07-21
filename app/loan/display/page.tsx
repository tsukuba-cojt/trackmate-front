"use client"

import LoanHistory from "@/components/loanDetail";
import LoanDetail from "@/components/loanDetail";
import Switcher from "@/components/switcher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UUID } from "crypto";
import { decodeAction } from "next/dist/server/app-render/entry-base";
import { useEffect, useState } from "react";
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

const fetcher = async (url: string | URL | Request) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }

  return response.json();
}

export interface ApiDetail {
  date: Date, 
  amount: number, 
}

export interface LoanDetail extends ApiDetail {
  key: UUID
}

export interface ApiLoanObject {
  person_name: string;
  sum_amount: number;
  is_debt: boolean;
  history: LoanDetail[];
}

export interface ClientLoanObject extends ApiLoanObject{
    isOpen: boolean,
    key: UUID, 
}

export default function Display() {
  const { data, error, isLoading } = useSWR<ApiLoanObject[]>('http://162.43.27.178:8000/loan', fetcher);

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

  const handleCardClick = (clickedKey: UUID) => {
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