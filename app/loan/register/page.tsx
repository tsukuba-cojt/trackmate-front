"use client"

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import TransitionButton from "@/components/transition";
import { useRouter } from "next/navigation";
import PersonInputFrom from "@/components/PersonInputForm";
import PersonListItem from "@/components/PersonListItem";
import usePerson from "@/hooks/usePerson";
import { HttpError } from "@/uitls/HttpError";
import ErrorPage from "@/components/errorPage";
import { stat } from "fs";

type apiPerson = {
  person_id: string,
  person_name: string
}

type Person = {
  id: string, 
  name: string
}

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
  const [persons, setPersons] = useState<Person[]>([]);
  const [displayErrorPage, setDisplayErrorPage] = useState<{statusCode: number, message: string} | null>(null);

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mb-20 bg-white";

  const { responsePerson, error, isLoading, mutatePersons } = usePerson();

  if (error) {
    if (error instanceof HttpError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        router.push("/");
      }
      if (error.statusCode === 500) {
        setDisplayErrorPage({statusCode: error.statusCode, message: "もう一度接続してください"});
      }
    }
  }

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
    try {
      await deletePorson(deletedPersonId);
      mutatePersons();
    } 
    catch {
      if (error.statusCode === 401 || error.statusCode === 403) {
        router.push("/");
        return;
      }
      let statusCode: number;
      let errorMessage: string;
      if (error.statusCode === 400 || error.statusCode === 500) {
        statusCode = error.statusCode;
        errorMessage = "もう一度接続してください"
        setDisplayErrorPage({statusCode: statusCode, message: errorMessage})
      } else if (error.statusCode === 404) {
        // 削除する相手が見つからなかった時の挙動
      } else if (error.statusCode == 409) {
        // TODO: 削除する相手とまだ貸し借りが残っている場合の挙動
      } else {
        setDisplayErrorPage({statusCode: error.statusCode, message: error.message})
      }
    }
  }

  const handleClickAddButton = async (newPersonName: string) => {
    try{
      await postPerson(newPersonName);
      mutatePersons();
    }
    catch {
      if (error.statusCode === 401 || error.statusCode === 403) {
        router.push("/");
        return;
      }
      let statusCode: number;
      let errorMessage: string;
      if (error.statusCode === 400 || error.statusCode === 500) {
        statusCode = error.statusCode;
        errorMessage = "もう一度接続してください"
        setDisplayErrorPage({statusCode: statusCode, message: errorMessage})
      } else if (error.statusCode === 409) {
        // TODO 重複している時のpopup画面表示
      } else {
        setDisplayErrorPage({statusCode: error.statusCode, message: error.message})
      }
    }
  }

  const handleClickBackButton = () => {
    
  }

  if (displayErrorPage) {
    return (
      <ErrorPage
      statusCode={displayErrorPage.statusCode} 
      errorMessage={displayErrorPage.message}
      >
      </ErrorPage>
    )
  }

  if (!isLoading && !error) return (
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