"use client"

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import usePerson from "@/hooks/usePerson";
import { HttpError } from "@/uitls/HttpError";
import ErrorPage from "@/components/errorPage";
import useDialog from "@/hooks/useDialog";
import useErrorPage from "@/hooks/useErrorPage";
import RegisterComponent from "@/components/RegisterComponent";

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

  // error用のhooks
  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  const [newName, setNewName] = useState<string>("");
  const handleNewValuChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  }

  // 貸し借り相手の取得
  const [persons, setPersons] = useState<Person[]>([]);
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

  const handleClickBackButton = () => {
    router.back();
  }

  const handleClickDeleteButton = async (deletedItemId: string) => {
    const deletedPersonName = persons.find((person) => person.id === deletedItemId)?.name;

    try {
      await deletePorson(deletedItemId);
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
    <RegisterComponent<Person>
    dialogProps={dialogProps}
    items={persons}
    newValue={newName} 
    onChangeNewValue={handleNewValuChange} 
    onClickBackButton={handleClickBackButton}
    onClickDeleteButton={handleClickDeleteButton} 
    onClickAddButton={handleClickAddButton} 
    />
  );
}