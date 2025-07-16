"use client"
import Switcher from "@/components/switcher";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Display() {
  const { data, error, isLoading } = useSWR("http://localhost:8080/expenses", fetcher)

  return (
    <div className="flex flex-col w-full items-center">
      <div className="text-4xl font-bold my-4">
        支出
      </div>
      {/* タブボタン */}
      <Switcher
        leftText="表示"
        leftLink="payment/display"
        rightText="入力"
        rightLink="/payment/input"
        focus="left">
      </Switcher>

      {/* display内容はそのまま */}
      <div className="w-4/5">
        <div className="gap-4 w-full mb-4">
          <Card className="w-full">
            <CardTitle className="ml-3">使用金額</CardTitle>
            <CardContent className="text-black font-bold text-3xl text-center">
              {data.expenses_sum}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Card>
            <CardTitle className="ml-3">今月の予算</CardTitle>
            <CardContent className="text-black font-bold text-3xl text-center">
              {data.budget}
            </CardContent>
          </Card>
          <Card>
            <CardTitle className="ml-3">今月の残り額</CardTitle>
            <CardContent className="text-black font-bold text-3xl text-center">
              {data.remaining_budget}
            </CardContent>
          </Card>
          <Card>
            <CardTitle className="ml-3">負債</CardTitle>
            <CardContent className="text-red-500 font-bold text-3xl text-center">
              {data.debt_sum}
            </CardContent>
          </Card>
          <Card>
            <CardTitle className="ml-3">貸し</CardTitle>
            <CardContent className="text-green-500 font-bold text-3xl text-center">
              {data.loan_sum}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}