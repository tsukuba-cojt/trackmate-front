"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Value } from "@radix-ui/react-select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  person: z.string().min(1, {
    message: "人を入力してください",
  }).max(50),
  dob: z.date({
    required_error: "日付を入力してください",
  }),
  amount: z.coerce.number({
    message: "数字を入力してください"
  }).min(1, { message: "金額を入力してください" }),
})


type nameItem = {
  id: number
  name: string, 
}

export default function InputPage() {
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

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6";
  const selectedButtonStyle: string = buttonStyle + " bg-gray-100";
  const unselectedButtonStyle: string = buttonStyle;
  const lendButtonStyle: string= isSelectedLend? selectedButtonStyle: unselectedButtonStyle;
  const rentButtonStyle: string = !isSelectedLend? selectedButtonStyle: unselectedButtonStyle;

  const [selectedNames, setSelectedNamse] = useState<nameItem[]>([
    {id: 1, name: "やすの"}, {id: 2, name: "Astalum"}, {id: 3, name: "こまつさん"}
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      person: "", 
      amount: undefined
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("heelo");
    console.log(values)
  }

  return (
    <div className="flex flex-col w-full items-center justify-center gap-y-16 ">
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-4/5">
          <div className="flex flex-col items-center w-full gap-10">
            <div className="grid grid-cols-[1fr_3fr_1fr] place-items-center gap-2">
              <p className="font-bold self-start">人</p>

              {/* 人を選択するselectタグ */}
              <FormField
                control={form.control}
                name="person"
                render={({ field }) => (
                  <FormItem className="w-full min-h-16">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {selectedNames.map((item) => 
                            (<SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant={"outline"} className="border-gray-400 font-bold self-start" size={"sm"} onClick={() => handleRegisterButtonClick()}>編集</Button>

              <p className="font-bold self-start">日付</p>

              {/* カレンダーから日付を選択 */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full col-span-2 min-h-16">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span></span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="font-bold self-start">金額</p>
              
              {/* 金額を入力するフィールド */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="min-h-16">
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="font-bold self-start">円</p>
            </div>
            <Button type="submit" variant="outline" className={buttonStyle}>決定</Button>
          </div>
        </form>
      </Form>

    </div>
  );
}