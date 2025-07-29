"use client"

import DeleteListItem from "@/components/DeleteListItem";
import ErrorPage from "@/components/errorPage";
import useDialog from "@/hooks/useDialog";
import useErrorPage from "@/hooks/useErrorPage";
import useExpensesDetail from "@/hooks/useExpensesDetail";
import { HttpError } from "@/uitls/HttpError";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react"
import { PopUpComponent } from "@/components/popUpComponent";
import Header from "@/components/_Header";

export type ExpenseDetail = {
  id: string, 
  expenseAmount: number, 
  expenseCategoryName: string
}

const deleteExpense = async (deletedExpenseId: string) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "expenses"

  const res = await fetch(url, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({expense_id: deletedExpenseId})
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    console.log(res.status);
    throw new HttpError(errorData.message, res.status);
  }
}

export default function SettingExpensesPage() {
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  console.log(date)

  let formDate = "";
  if (date) {formDate= format(date, 'yyyy-MM-dd')};
  const {expenseDetails, error, isLoading, mutateExpenseDetails} = useExpensesDetail(formDate);
  console.log(expenseDetails);

  // error用のhooks
  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  const handleClickDeleteButton = async (deletedItemId: string) => {
    try {
      await deleteExpense(deletedItemId);
      mutateExpenseDetails();
      openDialog("削除しました", 
            "/check_mark.svg")
    } 
    catch(error: any) {
      if (error instanceof HttpError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
          return;
        }
        if (error.statusCode === 400 || error.statusCode === 500) {
          showErrorPage(error.statusCode, "もう一度接続してください")
        } else if (error.statusCode === 404) {
          openDialog(`見つかりません`, "/注意のアイコン.svg")
        } else {
          showErrorPage(error.statusCode, error.message)
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
  if (!error && !isLoading) return (
    <>
      <Header title="支出記録"></Header>
      <div className="flex flex-col w-full h-screen items-center bg-theme-50">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal mt-16"
            >
              {date ? date.toLocaleDateString() : "日付選択"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                console.log(date);
                setDate(date)
                setOpen(false)
                mutateExpenseDetails();
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-col grow items-center gap-4 w-3/4 m-15">
          {
            expenseDetails.map((expenseDetail) => 
              (
                <DeleteListItem
                key={expenseDetail.id}
                item={expenseDetail}
                onDelete={handleClickDeleteButton}
                renderContent={(item) => {
                  return (
                    <div className="flex justify-between px-0 pl-4">
                      <p className="pl-2">{expenseDetail.expenseCategoryName}</p>
                      <p>{expenseDetail.expenseAmount}円</p>
                    </div>
                  )
                }
                }
                />
              )
            )
          }
          <PopUpComponent
          {...dialogProps}
          ></PopUpComponent>
        </div>
      </div>
    </>
  )
}