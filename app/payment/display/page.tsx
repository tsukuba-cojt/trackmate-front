"use client"
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Display() {
  const [activeTab, setActiveTab] = useState<"display" | "input">("display")
  return (
    <div className="flex flex-col w-full items-center">
      <div className="text-4xl font-bold my-4">
        {activeTab === "display" ? "支出" : "入力"}
      </div>
      {/* タブボタン */}
      <div className="flex gap-10 mb-4">
        <button className={`
          ${activeTab === "display" ? "text-2xl border-b-4 border-black font-bold" : "text-2xl border-transparent text-gray-300"}`}
          onClick={() => setActiveTab("display")}
        >
          支出
        </button>
        <button className={`
          ${activeTab === "input" ? "text-2xl border-b-4 border-black font-bold" : "text-2xl border-transparent text-gray-300"}`}
          onClick={() => setActiveTab("input")}
        >
          入力
        </button>
      </div>

      {activeTab === "display" ? (
        <div className="w-full">
          <div className="gap-4 w-full px-4">
            <Card className="w-full">
              <CardTitle>使用金額</CardTitle>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full p-4">
            <Card>
              <CardTitle className="ml-3">今月の予算</CardTitle>
            </Card>
            <Card>
              <CardTitle className="ml-3">今月の残り額</CardTitle>
            </Card>
            <Card>
              <CardTitle className="ml-3">負債</CardTitle>
              <CardContent className="text-red-500 font-bold text-3xl text-center">
                1000円
              </CardContent>
            </Card>
            <Card>
              <CardTitle className="ml-3">貸し</CardTitle>
            </Card>
          </div>
        </div>
      ) : (
        <div className="w-full px-4">
          <h2 className="text-lg font-bold mb-2">金額の入力</h2>
        </div>
      )}
    </div>
  );
}