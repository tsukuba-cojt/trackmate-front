"use client"

import { useState } from "react";
import { Button } from "./ui/button";


export default function DebtRentToggleButton() {
  const [isSelectedLend, setIsLend] = useState<boolean>(true);

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6";
  const selectedButtonStyle: string = buttonStyle + " bg-gray-100";
  const unselectedButtonStyle: string = buttonStyle;
  const lendButtonStyle: string= isSelectedLend? selectedButtonStyle: unselectedButtonStyle;
  const rentButtonStyle: string = !isSelectedLend? selectedButtonStyle: unselectedButtonStyle;

  const handleLendButtonClick = () => {
    if (!isSelectedLend) setIsLend(!isSelectedLend);
  }
  const handleRentButtonClick = () => {
    if (isSelectedLend) setIsLend(!isSelectedLend);
  }

  return (
    <div className="flex gap-6">
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