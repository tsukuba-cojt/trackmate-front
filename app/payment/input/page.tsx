"use client"
import Switcher from "@/components/switcher";
import { UUID } from "crypto";
import { useState } from "react";
import useSWR from "swr";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiZXhwIjoxNzUyODMxMzA5LCJzdWIiOiIzYThjNGMxYy1mNDNkLTQ1ZjItOGE2My02NjcxNTNkOTgxNDgifQ.0VKFWjluZ9osC72nUg7fm6EVlJOd2dOd2q7urFdcXVc"

const fetcher = (url: string) => fetch(url, {
  headers: {
    "Authorization": `Bearer ${token}`,
  },
}).then(res => res.json())



export default function Input() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  const { data: data, error: any, isLoading: boolean } = useSWR("http://162.43.27.178:8080/categories", fetcher)

  type data = {
    data: {
      category_id: UUID,
      category_name: string,
      sum: number
    }
  }

  const handleSubmit = async () => {
    if (!date) {
      alert("日付を入力してください");
      return;
    }

    if (!amount) {
      alert("支出金額を入力してください");
      return;
    }

    if (Number(amount) <= 0) {
      alert("正しい金額を入力してください")
    }

    const payload = {
      expense_date: date,
      expense_amount: Number(amount),
    };

    try {
      const res = await fetch("http://localhost:8080/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }

      alert("登録完了！");
      setDate("");
      setAmount("");
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
    }
  };


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
        focus="right">
      </Switcher>

      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <label className="flex flex-col">
          <span>日付</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span>支出</span>
          <div className="flex items-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="1"
              className="border p-2 rounded w-full"
            />
            <span className="ml-2 whitespace-nowrap">円</span>
          </div>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 border border-black rounded px-6 py-2"
      >
        決定
      </button>
      {data.data.sumAmount}
    </div>
  )
}