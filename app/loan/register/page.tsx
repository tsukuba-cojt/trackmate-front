"use client"

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import TransitionButton from "@/components/transition";
import { useRouter } from "next/navigation";
import PersonInputFrom from "@/components/PersonInputForm";
import PersonListItem from "@/components/PersonListItem";
import usePerson from "@/hooks/usePerson";

type apiPerson = {
  person_id: string,
  person_name: string
}

type Person = {
  id: string, 
  name: string
}

// TODO: status codeによって挙動を変える
const postPerson = async (newName: string) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "person"

  const res = await fetch(url, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({person_name: newName})
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    throw new Error(errorData.message || 'Failed to fetch person data');
  }
}

const deletePorson = async (deletedPersonId: string) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "person"

  const res = await fetch(url, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({person_id: deletedPersonId})
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    throw new Error(errorData.message || 'Failed to fetch person data');
  }
}

export default function Register() {
  const router = useRouter();

  const [newPersonName, setNewPersonName] = useState<string>("");

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mb-20 bg-white";

  const { responsePerson, error, isLoading, mutatePersons } = usePerson();

  const [persons, setPersons] = useState<Person[]>([])

  useEffect(() => {
    if (responsePerson && responsePerson.data) {
      const newPersons = responsePerson.data.map((responsePersonItem: apiPerson) => {
        return (
          {
            id: responsePersonItem.person_id, 
            name: responsePersonItem.person_name
          }
        )
      });
      setPersons(newPersons);
    }
  }, [responsePerson, error])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPersonName(e.target.value);
  }

  const handleClickDeleteButton = async (deletedPersonId: string) => {
    await deletePorson(deletedPersonId);
    mutatePersons();
  }

  const handleClickAddButton = async (newPersonName: string) => {
    await postPerson(newPersonName);
    mutatePersons();
  }

  const handleClickBackButton = () => {
    
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-theme-50">
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
          persons.map((person: Person) => 
            (
              <PersonListItem
              key={person.id}
              person={person}
              onDelete={handleClickDeleteButton}
              ></PersonListItem>
            )
          )
        }
      </div>
      <Button variant="outline" className={buttonStyle} onClick={() => handleClickBackButton()}>
        戻る
      </Button>
    </div>
  );
}