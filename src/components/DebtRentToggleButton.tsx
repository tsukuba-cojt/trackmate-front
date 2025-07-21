"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils"

type Props = {
  isSelectedLend: boolean,
  setIsSelectedLend: (newLendState: boolean) => void,
  className?: string
}

export default function DebtRentToggleButton({isSelectedLend, setIsSelectedLend, className}: Props) {
  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6";
  const selectedButtonStyle: string = buttonStyle + " ring-2 bg-gray-200";
  const unselectedButtonStyle: string = buttonStyle;
  const lendButtonStyle: string= isSelectedLend? selectedButtonStyle: unselectedButtonStyle;
  const rentButtonStyle: string = !isSelectedLend? selectedButtonStyle: unselectedButtonStyle;

  const handleLendButtonClick = () => {
    if (!isSelectedLend) setIsSelectedLend(!isSelectedLend);
  }
  const handleRentButtonClick = () => {
    if (isSelectedLend) setIsSelectedLend(!isSelectedLend);
  }

  return (
    <div className={cn("flex gap-6", className)}>
      <Button 
        variant="outline" 
        className={lendButtonStyle}
        onClick={() => handleLendButtonClick()}
      >
        貸し
      </Button>
      <Button 
        variant="outline" 
        className={rentButtonStyle}
        onClick={() => handleRentButtonClick()}
      >
        借り
      </Button>
    </div>
  );
}