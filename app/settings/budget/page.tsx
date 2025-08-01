"use client"

// 静的生成を無効化
export const dynamic = 'force-dynamic';

import Header from "@/components/_Header";
import ErrorPage from "@/components/errorPage";
import { PopUpComponent } from "@/components/popUpComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useDialog from "@/hooks/useDialog";
import useErrorPage from "@/hooks/useErrorPage";
import { HttpError } from "@/uitls/HttpError";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type FormData = {
  budget: number, 
  date: string
}

const postBudget = async (formData: FormData) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "budget"

  const res = await fetch(url, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(formData)
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    throw new HttpError(errorData.message, res.status);
  }
}

export default function SettingBudgetPage() {
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const moths = Array.from({ length: 12}, (_, i) => i+1);

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [inputBudget, setInputBudget] = useState<number>(0);

  // error用のhooks
  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedYear === "" || selectedMonth === "") {
      openDialog("年月を入力してください", "/注意のアイコン.svg");
    } else if (Number(selectedYear) === currentYear && Number(selectedMonth) < currentMonth) {
      openDialog("過去の予算は設定できません", "/注意のアイコン.svg");
    }

    const formData = {
      budget: inputBudget, 
      date: selectedYear + "-" + selectedMonth.padStart(2, '0') + "-01"
    }

    try{
      await postBudget(formData);
      openDialog("予算の設定が完了しました", "/check_mark.svg");
    }
    catch (error) { 
      if (error instanceof HttpError) {
        if (error.statusCode === 400) {
          openDialog("リクエストが不正です", "/注意のアイコン.svg");
        }
        else if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
        } else if (error.statusCode === 409) {
          openDialog("既に設定した予算は再設定できません", "/注意のアイコン.svg");
        } else if (error.statusCode === 500) {
          showErrorPage(500, "予期せぬエラーが発生しました");
        }
      } else {
        showErrorPage(500, "予期せぬエラーが発生しました");
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

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mt-16 bg-white";
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="予算設定"></Header>
      <form className="flex flex-col items-center gap-4 bg-theme-50 flex-grow" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex justify-center items-center gap-2 w-3/4 text-xl font-bold mt-16">
          <p>年月</p>
          <Select onValueChange={setSelectedYear} value={selectedYear}>
            <SelectTrigger id="year" className="w-[100px] text-center text-xl font-normal bg-white">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p>年</p>
          <Select onValueChange={setSelectedMonth} value={selectedMonth}>
            <SelectTrigger id="year" className="flex-grow text-center text-xl font-normal bg-white">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {moths.map((month) => (
                <SelectItem key={month} value={String(month)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p>月</p>
        </div>

        <div className="flex justify-center items-center gap-2 w-3/4 text-xl font-bold">
          <p >予算</p>
          <Input 
          className="flex-[1] text-xl text-left font-normal bg-white" 
          onChange={(e) => setInputBudget(Number(e.target.value))}
          type="number"></Input>
          <p>円</p>
        </div>

        <Button variant="outline" className={buttonStyle} type="submit">
          決定
        </Button>
      </form>

      <PopUpComponent {...dialogProps} />
    </div>
    

    
  )
}