"use client"

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ButtonAndInputForm from "@/components/ButtonAndInputForm";
import DeleteListItem from "@/components/DeleteListItem";
import usePerson from "@/hooks/usePerson";
import { HttpError } from "@/uitls/HttpError";
import ErrorPage from "@/components/errorPage";
import { PopUpComponent } from "@/components/popUpComponent";
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
    <RegisterComponent
    dialogProps={dialogProps}
    items={persons}
    showErrorPage={showErrorPage}
    openDialog= {openDialog}
    mutatePersons= {mutatePersons}
    postPerson={postPerson}
    deletePorson={deletePorson}
    />
  );
}