"use client"

import InputExpenseComponent from "@/components/InputExpenseComponent";
import Switcher from "@/components/switcher";
import { Button } from "@/components/ui/button";
import useCategory from "@/hooks/useCategory";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { format } from 'date-fns';
import useErrorPage from "@/hooks/useErrorPage";
import useDialog from "@/hooks/useDialog";
import { PopUpComponent } from "@/components/popUpComponent";
import { HttpError } from "@/uitls/HttpError";
import ErrorPage from "@/components/errorPage";
import Header from "@/components/_Header";

type FormData = {
  expense_date: string,
  expense_amount: number,
  category_id: string
}

const postExpense = async (formData: FormData) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "expenses";

  const res = await fetch(url, {
    "method": "POST", 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }, 
    "body": JSON.stringify(formData)
  })

  if (!res.ok) {
    let errorDetail: any;
    try {
      errorDetail = await res.json();
    } catch (e) {
      errorDetail = { message: res.statusText || 'An unknown error occurred' };
    }
    throw new Error(errorDetail.message || `Failed to create loan: ${res.status}`);
  }
}

export default function ExpenseInputPage() {
  // エラー表示用のhooks
  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<number>(0);

  const {categories, setCategories, error, isLoading, mutateCategories} = useCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );

  useEffect(() => {
    setSelectedCategoryId(categories.length > 0 ? categories[0].id : null);
  }, [categories])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) {
      openDialog("日付を選択してください", "/注意のアイコン.svg")
      return;
    }
    if (!selectedCategoryId) {
      openDialog("カテゴリを選択してください", "/注意のアイコン.svg")
      return;
    }
    if (amount === 0) {
      openDialog("金額を入力してください", "/注意のアイコン.svg")
      return;
    }

    const formDate = format(date, 'yyyy-MM-dd');
    const formData = {
      expense_date: formDate,
      expense_amount: amount,
      category_id: selectedCategoryId
    }

    try{
      await postExpense(formData);
      openDialog("追加が完了しました!", "/check_mark.svg")
    }
    catch (error) {
      if (error instanceof HttpError) { 
        if (error.statusCode === 400) {
          openDialog("リクエストが不正です", "/注意のアイコン.svg");
        } else if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
        } else if (error.statusCode === 500) {
          showErrorPage(500, "予期せぬエラーが発生しました");
        }
      } else {
        showErrorPage(500, "予期せぬエラーが発生しました");
      }
    }
  }

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mt-12";

  if (displayErrorPage) {
      return (
        <ErrorPage
        statusCode={displayErrorPage.statusCode} 
        errorMessage={displayErrorPage.message}
        >
        </ErrorPage>
      )
    }

  if (!error && !isLoading) {
    return (
      <>
      <Header title="支出"></Header>
      <form className="flex flex-col items-center h-screen bg-theme-50" onSubmit={handleSubmit}>

        <Switcher
        leftText="表示"
        leftLink="/expense/display"
        rightText="入力"
        rightLink="/expense/input"
        focus="right"
        className="my-10"
        ></Switcher>

        <InputExpenseComponent
        open={open}
        setOpen={setOpen}
        date={date}
        setDate={setDate}
        amount={amount}
        setAmount={setAmount}
        ></InputExpenseComponent>

        <div className="flex font-bold items-center gap-4 mt-8 w-full pr-auto pl-4 text-xl mb-4">
          <p>カテゴリー</p>
          <Button variant={"outline"} className="border-gray-400 font-bold self-start" size={"sm"} onClick={() => router.push("/settings/category")} type="button">編集</Button>
        </div>

        <div className="grid grid-cols-3 place-items-center w-4/5 gap-2">
          {
            categories.map((category) => {
              return (
                <p key={category.id} 
                className={selectedCategoryId !== category.id ?
                  "flex items-center justify-center font-bold h-20 bg-gray-300 text-center rounded-2xl w-full" : "flex items-center justify-center font-bold h-20 bg-gray-300 text-center rounded-2xl w-full ring-2"}
                onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </p>
              )
            })
          }
        </div>

        <Button type="submit" variant="outline" className={buttonStyle}>決定</Button>

        <PopUpComponent {...dialogProps} />
      </form>
      </>
    )
  }
}