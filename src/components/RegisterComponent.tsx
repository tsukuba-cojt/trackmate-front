import { useRouter } from "next/navigation"
import ButtonAndInputForm from "./ButtonAndInputForm"
import DeleteListItem from "./DeleteListItem"
import { PopUpComponent } from "./popUpComponent"
import { Button } from "./ui/button"
import { ChangeEvent, useState } from "react"
import { HttpError } from "@/uitls/HttpError"

type TData = {
  id: string, 
  name: string
}

type DialogProps =  {
    isOpen: boolean,
    onClose: () => void,
    errorMessage: string,
    imgPath: string
  }

type Props<TItem extends TData> = {
  dialogProps: DialogProps, 
  items: TItem[], 
  showErrorPage: (statusCode: number, errorMessage :string) => void, 
  openDialog: (message: string, imgPath: string) => void, 
  mutatePersons: () => void, 
  postPerson: (id: string) => void, 
  deletePorson: (name: string) => void
}

export default function RegisterComponent<TItem extends TData>({
  dialogProps,
  items,
  showErrorPage,
  openDialog, 
  mutatePersons, 
  postPerson, 
  deletePorson,
}: Props<TItem>) {
  const router = useRouter();

  const [newValue, setNewValue] = useState<string>("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  }

  const handleClickBackButton = () => {
    router.back();
  }

  const handleClickDeleteButton = async (deletedItemId: string) => {
      const deletedPersonName = items.find((item) => item.id === deletedItemId)?.name;
  
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

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mb-20 bg-white";
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-theme-50">
      <div className="text-2xl font-bold mt-10">
        貸した・借りた人編集
      </div>

      <div className="flex flex-col grow items-center gap-4 w-3/4 m-15">
        <ButtonAndInputForm
        newValue={newValue}
        onChange={handleChange}
        onAddClick={handleClickAddButton}
        />

        {
          items.map((item) => 
            (
              <DeleteListItem
              key={item.id}
              item={item}
              onDelete={handleClickDeleteButton}
              renderContent={(item) => {
                return (
                  <>
                    {item.name}
                  </>
                )
              }
              }
              />
            )
          )
        }
      </div>
      <Button variant="outline" className={buttonStyle} onClick={() => handleClickBackButton()}>
        戻る
      </Button>

      <PopUpComponent {...dialogProps} />
    </div>
  )
}