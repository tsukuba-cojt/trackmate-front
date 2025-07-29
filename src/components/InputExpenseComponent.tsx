import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean, 
  setOpen: (newOpen: boolean) => void, 
  date: Date | undefined, 
  setDate: (date: Date | undefined) => void, 
  amount: number, 
  setAmount: (newAmount: number) => void
}

export default function InputExpenseComponent({open, setOpen, date, setDate, amount, setAmount}: Props) {
  return (
    <div className="grid grid-cols-[1fr_3fr_1fr] place-items-center gap-2 font-bold text-xl w-">
        <p>日付</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="justify-between font-normal w-full"
            >
              {date ? date.toLocaleDateString() : "日付を選択"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>

        <p className="col-start-1">金額</p>
        <Input type="number" onChange={(e) => setAmount(Number(e.target.value))} className="bg-white"/>
        <p>円</p>
      </div>
  )
}