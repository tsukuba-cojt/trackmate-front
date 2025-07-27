"use client"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

import { AlignVerticalDistributeStart, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"

import {v4 as uuidv4} from "uuid"

import usePerson from "@/hooks/usePerson";

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

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UUID } from "crypto";

type Props = {
  isSelectedLend: boolean
}

type apiPerson = {
  person_id: string,
  person_name: string
}

type nameItem = {
  id: string,
  name: string, 
}

type LoanItem = {
  person: string,
  is_debt: boolean, 
  date: Date,
  amount: number
}

const formSchema = z.object({
  person: z.string().min(1, {
    message: "人を入力してください",
  }).max(50),
  date: z.date({
    required_error: "日付を入力してください",
  }),
  amount: z.coerce.number({
    message: "数字を入力してください"
  }).min(1, { message: "金額を入力してください" }),
  is_debt: z.boolean()
})

const postLoan = async (newLoan: LoanItem, selectedNames: nameItem[]) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "loan";

  let personId: string | undefined;
  const foundPerson = selectedNames.find((selectedName) => selectedName.name === newLoan.person);
  if (foundPerson) {
    personId = foundPerson.id;
  } else {
    console.warn(`"${newLoan.person}" に一致する人物が見つかりませんでした。`);

    throw new Error(`Person with name "${newLoan.person}" not found.`);
  }

  const year = newLoan.date.getFullYear();
  const month = (newLoan.date.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1し、2桁にする
  const day = newLoan.date.getDate().toString().padStart(2, '0');       // 日を2桁にする
  const formattedDate = `${year}-${month}-${day}`;

  const apiBody = {
    person_id: personId, 
    is_debt: newLoan.is_debt, 
    date: formattedDate, 
    amount: newLoan.amount
  }

  const res = await fetch(url, {
    "method": "POST", 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }, 
    "body": JSON.stringify(apiBody)
  })

  if (!res.ok) {
    let errorDetail: any;
    try {
      errorDetail = await res.json();
    } catch (e) {
      errorDetail = { message: res.statusText || 'An unknown error occurred' };
    }
    throw new Error(errorDetail.message || `Failed to create loan: ${res.status}`);
  }
}

export default function LoanInputForm({isSelectedLend}: Props) {
  const router = useRouter();
  const {responsePerson, error, isLoading} = usePerson();
  

  const [selectedNames, setSelectedNamse] = useState<nameItem[]>([
    {id: uuidv4(), name: "やすの"}, {id: uuidv4(), name: "Astalum"}, {id: uuidv4(), name: "こまつさん"}
  ]);

  useEffect(() => {
    if (responsePerson && responsePerson.data){
      console.log(responsePerson)
      const newSelectedNames = responsePerson.data.map((apiPersonItem: apiPerson) => {
        return ({
          id: apiPersonItem.person_id, 
          name: apiPersonItem.person_name
        }
        );
      })
      setSelectedNamse(newSelectedNames);
    }
  }, [responsePerson, error])

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      person: "", 
      amount: 1,
      date: new Date(),
      is_debt: isSelectedLend
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await postLoan(values, selectedNames);
  }

  const handleRegisterButtonClick = () => {
    const redirectTo: string = "/loan/register";
    router.push(redirectTo);
  }

  useEffect(() => {
    form.setValue("is_debt", isSelectedLend);
  }, [isSelectedLend, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-4/5">
        <div className="flex flex-col items-center w-full gap-16">
          <div className="grid grid-cols-[1fr_3fr_1fr] place-items-center gap-2">
            <p className="font-bold self-start">相手</p>

            {/* 人を選択するselectタグ */}
            <FormField
              control={form.control}
              name="person"
              render={({ field }) => (
                <FormItem className="w-full min-h-16">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder=""/>
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

            <Button variant={"outline"} className="border-gray-400 font-bold self-start" size={"sm"} onClick={() => handleRegisterButtonClick()} type="button">編集</Button>

            <p className="font-bold self-start">日付</p>

            {/* カレンダーから日付を選択 */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full col-span-2 min-h-16">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal self-center",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年 M月 d日")
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
                    <Input placeholder="" {...field} className="bg-white"/>
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
  );
}