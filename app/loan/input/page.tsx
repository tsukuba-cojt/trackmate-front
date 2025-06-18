"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Value } from "@radix-ui/react-select";

type nameItem = {
  id: number
  name: string, 
}


export default function Input() {
  const router = useRouter();

  const [isSelectedLend, setIsLend] = useState<boolean>(true);

  const handleLendButtonClick = () => {
    if (!isSelectedLend) setIsLend(!isSelectedLend);
  }
  const handleRentButtonClick = () => {
    if (isSelectedLend) setIsLend(!isSelectedLend);
  }
  const handleRegisterButtonClick = () => {
    const redirectTo: string = "/loan/register";
    router.push(redirectTo);
  }

  const selectedButtonStyle: string = "border-black text-2xl bg-gray-100 font-bold border-1 px-12 py-6";
  const unselectedButtonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6";
  const lendButtonStyle: string= isSelectedLend? selectedButtonStyle: unselectedButtonStyle;
  const rentButtonStyle: string = !isSelectedLend? selectedButtonStyle: unselectedButtonStyle;

  const [selectedNames, setSelectedNamse] = useState<nameItem[]>([
    {id: 1, name: "やすの"}, {id: 2, name: "Astalum"}, {id: 3, name: "こまつさん"}
  ]);

  return (
    <div className="flex flex-col w-full items-center justify-center gap-8">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>

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

    <div className="flex items-center justify-between gap-2 w-4/5">
      <p className="font-bold">人</p>

      <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
          <SelectGroup>
            {selectedNames.map((item) => 
              (<SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button variant={"outline"} className="border-gray-400 font-bold" size={"sm"} onClick={() => handleRegisterButtonClick()}>編集</Button>
    </div>

    </div>
  );
}