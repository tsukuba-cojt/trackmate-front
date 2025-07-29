import ButtonAndInputForm from "./ButtonAndInputForm"
import DeleteListItem from "./DeleteListItem"
import { PopUpComponent } from "./popUpComponent"
import { Button } from "./ui/button"
import { ChangeEvent} from "react"

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
  newValue: string, 
  onChangeNewValue: (e: ChangeEvent<HTMLInputElement>) => void, 
  onClickBackButton: () => void,
  onClickDeleteButton: (id: string) => void, 
  onClickAddButton: (id: string) => void, 
}

export default function RegisterComponent<TItem extends TData>({
  dialogProps,
  items,
  newValue, 
  onChangeNewValue, 
  onClickBackButton,
  onClickDeleteButton, 
  onClickAddButton, 
}: Props<TItem>) {

  const buttonStyle: string = "border-black text-2xl font-bold border-1 px-12 py-6 mb-20 bg-white";
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-theme-50">
      <div className="text-2xl font-bold mt-10">
        貸した・借りた人編集
      </div>

      <div className="flex flex-col grow items-center gap-4 w-3/4 m-15">
        <ButtonAndInputForm
        newValue={newValue}
        onChange={onChangeNewValue}
        onAddClick={onClickAddButton}
        />

        {
          items.map((item) => 
            (
              <DeleteListItem
              key={item.id}
              item={item}
              onDelete={onClickDeleteButton}
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
      <Button variant="outline" className={buttonStyle} onClick={() => onClickBackButton()}>
        戻る
      </Button>

      <PopUpComponent {...dialogProps} />
    </div>
  )
}