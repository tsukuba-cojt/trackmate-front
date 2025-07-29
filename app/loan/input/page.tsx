"use client"

import DebtRentToggleButton from "@/components/DebtRentToggleButton";
import LoanInputForm from "@/components/LoanInputForm";
import Switcher from "@/components/switcher";
import { useEffect, useState } from "react";
import usePerson from "@/hooks/usePerson";
import { HttpError } from "@/uitls/HttpError";
import { useRouter } from "next/navigation";
import useErrorPage from "@/hooks/useErrorPage";
import useDialog from "@/hooks/useDialog";
import ErrorPage from "@/components/errorPage";
import { PopUpComponent } from "@/components/popUpComponent";
import { z } from "zod"

type NameItem = {
  id: string,
  name: string, 
}

type LoanItem = {
  person: string,
  is_debt: boolean, 
  date: Date,
  amount: number
}

type ApiPerson = {
  person_id: string,
  person_name: string
}

const postLoan = async (newLoan: LoanItem, selectedNames: NameItem[]) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "loan";

  let personId: string | undefined;
  const foundPerson = selectedNames.find((selectedName) => selectedName.name === newLoan.person);
  if (foundPerson) {
    personId = foundPerson.id;
  } else {
    console.warn(`"${newLoan.person}" に一致する人物が見つかりませんでした。`);

    throw new Error(`Person with name "${newLoan.person}" not found.`);
  }

  const year = newLoan.date.getFullYear();
  const month = (newLoan.date.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1し、2桁にする
  const day = newLoan.date.getDate().toString().padStart(2, '0');       // 日を2桁にする
  const formattedDate = `${year}-${month}-${day}`;

  const apiBody = {
    person_id: personId, 
    is_debt: newLoan.is_debt, 
    date: formattedDate, 
    amount: newLoan.amount
  }

  const res = await fetch(url, {
    "method": "POST", 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }, 
    "body": JSON.stringify(apiBody)
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

const formSchema = z.object({
  person: z.string().min(1, {
    message: "人を入力してください",
  }).max(50),
  date: z.date({
    required_error: "日付を入力してください",
  }),
  amount: z.coerce.number({
    message: "数字を入力してください"
  }).min(1, { message: "金額を入力してください" }),
  is_debt: z.boolean()
})


export default function InputPage() {
  const router = useRouter();

  const [isSelectedLend, setIsSelectedLend] = useState<boolean>(true);

  // エラー表示用のhooks
  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  // 貸し借り相手の取得
  const [selectedNames, setSelectedNamse] = useState<NameItem[]>([]);
  const {responsePerson, error, isLoading} = usePerson();
  if (error) {
    if (error instanceof HttpError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        router.push("/");
      }
      if (error.statusCode === 500) {
        showErrorPage(error.statusCode, "もう一度接続してください");
      }
    }
  }
  useEffect(() => {
      if (responsePerson && responsePerson.data){
        console.log(responsePerson)
        const newSelectedNames = responsePerson.data.map((apiPersonItem: ApiPerson) => {
          return ({
            id: apiPersonItem.person_id, 
            name: apiPersonItem.person_name
          }
          );
        })
        setSelectedNamse(newSelectedNames);
      }
    }, [responsePerson, error])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      await postLoan(values, selectedNames);
      openDialog("追加完了しました！", "/check_mark.svg");
    }
    catch (error: any) {
      if (error instanceof HttpError) {
        if (error.statusCode === 401 || error.statusCode == 403) {
          router.push("/");
        } else if (error.statusCode == 400) {
          openDialog("貸し借りの入力が不正です", "/注意のマーク.svg");
        } else if (error.statusCode == 500) {
          showErrorPage(error.statusCode, "もう一度接続してください");
        } else {
          showErrorPage(500, "予期せぬエラーが発生しました");
        }
      } else {
        showErrorPage(500, "予期せぬエラーが発生しました");
      }
    }
  }

  // エラーページ
  if (displayErrorPage) {
    return (
      <ErrorPage
      statusCode={displayErrorPage.statusCode} 
      errorMessage={displayErrorPage.message}
      >
      </ErrorPage>
    )
  }

  if (!error && !isLoading) return (
    <div className="flex flex-col w-full min-h-screen items-center bg-theme-50">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>
      <Switcher
      leftText="表示"
      leftLink="/loan/display"
      rightText="入力"
      rightLink="/loan/input"
      focus="right"
      className="my-8"
      ></Switcher>
      <DebtRentToggleButton
      isSelectedLend={isSelectedLend}
      setIsSelectedLend={setIsSelectedLend}
      className="mb-15"
      ></DebtRentToggleButton>
      <LoanInputForm
      isSelectedLend={isSelectedLend}
      selectedNames={selectedNames}
      onSubmit={onSubmit}
      ></LoanInputForm>

      <PopUpComponent {...dialogProps} />
    </div>
  );
}