"use client"

import { ChangeEvent, SetStateAction, useState } from "react";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import TransitionButton from "@/components/transition";
import { useRouter } from "next/navigation";
import PersonInputFrom from "@/components/PersonInputForm";

type Person = {
  id: string, 
  name: string
}

export default function Register() {
  const router = useRouter();

  const [newPersonName, setNewPersonName] = useState<string>("");

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mb-20";

  const [persons, setPersons] = useState<Person[]>([
    {id: "1", name: "やす"}, 
    {id: "2", name: "やすの"}, 
    {id: "3", name: "小松さん"}, 
  ])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPersonName(e.target.value);
  }

  const handleClickDeleteButton = () => {

  }

  const handleClickAddButton = () => {

  }

  const handleClickBackButton = () => {

  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center">
      <div className="text-2xl font-bold mt-10">
        貸した・借りた人編集
      </div>

      <div className="flex flex-col grow items-center gap-4 w-3/4 m-15">
        <PersonInputFrom 
        newPersonName={newPersonName}
        onNameChange={handleChange}
        onAddClick={handleClickAddButton}
        ></PersonInputFrom>

        {
          persons.map((person: Person) => {
            return (
              <div 
              key={person.id}
              className="flex w-full h-12 bg-gray-300 rounded-2xl items-center relative">
                <button 
                className="w-8 h-8 bg-red-400 text-lg text-white font-semibold rounded-full absolute left-4"
                onClick={() => handleClickDeleteButton()}
                >
                  ー
                </button>
                <p className="flex-grow text-center font-bold text-lg px-12">
                  {person.name}
                </p>
              </div>
            );
          })
        }
      </div>
      <Button variant="outline" className={buttonStyle} onClick={() => handleClickBackButton()}>
        戻る
      </Button>
    </div>
  );
}