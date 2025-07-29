"use client"

import { ChangeEvent, useState } from "react";

import { useRouter } from "next/navigation";
import { HttpError } from "@/uitls/HttpError";
import ErrorPage from "@/components/errorPage";
import useDialog from "@/hooks/useDialog";
import useErrorPage from "@/hooks/useErrorPage";
import RegisterComponent from "@/components/RegisterComponent";
import useCategory from "@/hooks/useCategory";

type Category = {
  id: string, 
  name: string, 
}

const postPerson = async (newCategoryName: string) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "categories"

  const res = await fetch(url, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({expense_category_name: newCategoryName})
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    throw new HttpError(errorData.message, res.status);
  }
}

const deletePorson = async (deletedPersonId: string) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "categories"

  const res = await fetch(url, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({category_id: deletedPersonId})
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    console.log(res.status);
    throw new HttpError(errorData.message, res.status);
  }
}

export default function SettingCategoryPage() {
  const router = useRouter();
  
  // error用のhooks
  const {displayErrorPage, showErrorPage} = useErrorPage();
  const {dialogProps, openDialog} = useDialog();

  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const handleNewValuChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
  }

  // 貸し借り相手の取得
  const {categories, error, isLoading, mutateCategories} = useCategory();
  if (error) {
    if (error instanceof HttpError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        router.push("/login");
      } 
      else if (error.statusCode === 500) {
        showErrorPage(500, "予期せぬエラーが発生しました");
      }
    } else {
      showErrorPage(500, "予期せぬエラーが発生しました");
    }
  }

  const handleClickBackButton = () => {
    router.back();
  }

  const handleClickDeleteButton = async (deletedCategoryId: string) => {
    const deletedCategoryName = categories.find((category) => category.id === deletedCategoryId)?.name;

    try {
      await deletePorson(deletedCategoryId);
      mutateCategories();
      openDialog(`${deletedCategoryName}を削除しました`, 
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
          openDialog(`${deletedCategoryName}は見つかりません`, "/注意のアイコン.svg")
        } else {
          showErrorPage(error.statusCode, error.message)
        }
      } else {
        showErrorPage(500, "予期せぬエラーが発生しました");
      }
    }
  }

    const handleClickAddButton = async (newCategoryName: string) => {
      try{
        await postPerson(newCategoryName);
        mutateCategories();
        openDialog(`${newCategoryName}を追加しました`, "/check_mark.svg");
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
              `${newCategoryName}は既に存在しています`, 
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
    <RegisterComponent<Category>
    dialogProps={dialogProps}
    items={categories}
    newValue={newCategoryName} 
    onChangeNewValue={handleNewValuChange} 
    onClickBackButton={handleClickBackButton}
    onClickDeleteButton={handleClickDeleteButton} 
    onClickAddButton={handleClickAddButton} 
    />
  );
}
