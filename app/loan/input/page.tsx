"use client"

import DebtRentToggleButton from "@/components/DebtRentToggleButton";
import LoanInputForm from "@/components/LoanInputForm";

export default function InputPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-y-16 ">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>

      <DebtRentToggleButton></DebtRentToggleButton>
      <LoanInputForm></LoanInputForm>
    </div>
  );
}