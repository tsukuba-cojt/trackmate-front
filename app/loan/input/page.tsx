"use client"

import DebtRentToggleButton from "@/components/DebtRentToggleButton";
import LoanInputForm from "@/components/LoanInputForm";
import Switcher from "@/components/switcher";
import { useState } from "react";

export default function InputPage() {
  const [isSelectedLend, setIsSelectedLend] = useState<boolean>(true);

  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-theme-50">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>
      <Switcher
      leftText="表示"
      leftLink="loan/display"
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
      ></LoanInputForm>
    </div>
  );
}