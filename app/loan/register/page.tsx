"use client"

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import PersonInputFrom from "@/components/PersonInputForm";
import PersonListItem from "@/components/PersonListItem";
import usePerson from "@/hooks/usePerson";
import { HttpError } from "@/uitls/HttpError";
import ErrorPage from "@/components/errorPage";
import { PopUpComponent } from "@/components/popUpComponent";
import useDialog from "@/hooks/useDialog";
import useErrorPage from "@/hooks/useErrorPage";

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
    throw new HttpError(errorData.message, res.status);
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
    console.log(res.status);
    throw new HttpError(errorData.message, res.status);
  }
}

export default function Register() {
  const router = useRouter();

  const [newPersonName, setNewPersonName] = useState<string>("");
  const [persons, setPersons] = useState<Person[]>([]);

  // error用のhooks
  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  // 貸し借り相手の取得
  const { responsePerson, error, isLoading, mutatePersons } = usePerson();
  if (error) {
    if (error instanceof HttpError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        router.push("/");
      }
      if (error.statusCode === 500) {
        showErrorPage(error.statusCode, "もう一度接続してください");
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
    const deletedPersonName = persons.find((person) => person.id === deletedPersonId)?.name;

    try {
      await deletePorson(deletedPersonId);
      mutatePersons();
      openDialog(`${deletedPersonName}を削除しました`, 
            "/check_mark.svg")
    } 
    catch(error: any) {
      if (error instanceof HttpError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/");
          return;
        }
        if (error.statusCode === 400 || error.statusCode === 500) {
          showErrorPage(error.statusCode, "もう一度接続してください")
        } else if (error.statusCode === 404) {
          openDialog(`${deletedPersonName}は見つかりません`, "/注意のアイコン.svg")
        } else if (error.statusCode == 409) {
          openDialog(
            `${deletedPersonName}との貸し借りが精算されていないので，${deletedPersonName}の削除ができません`, 
            "/注意のアイコン.svg"
          )
        } else {
          showErrorPage(error.statusCode, error.message)
        }
      } else {
        showErrorPage(500, "予期せぬエラーが発生しました");
      }
    }
  }

  const handleClickAddButton = async (newPersonName: string) => {
    try{
      await postPerson(newPersonName);
      mutatePersons();
      openDialog(`${newPersonName}を追加しました`, "/check_mark.svg");
    }
    catch(error: any) {
      if (error instanceof HttpError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/");
          return;
        }
        if (error.statusCode === 400 || error.statusCode === 500) {
          showErrorPage(error.statusCode, "もう一度接続してください")
        } else if (error.statusCode === 409) {
          openDialog(
            `${newPersonName}は既に存在しています`, 
            "/注意のアイコン.svg"
          )
        } else {
          showErrorPage(error.statusCode, error.message)
        }
      } else {
        showErrorPage(500, "予期せぬエラーが発生しました");
      }
    }
  }

  const handleClickBackButton = () => {
    router.back();
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

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mb-20 bg-white";
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

      <PopUpComponent {...dialogProps} />
    </div>
  );
}