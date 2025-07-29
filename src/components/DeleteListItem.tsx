import { cn } from "@/lib/utils"

type ListItemData<TId extends string | number = string> = {
  id: TId
}

type Props<TItem extends ListItemData<TId>, TId extends string | number = string> = {
  item: TItem, 
  onDelete: (deletedItemId: TId) => void, 
  renderContent: (item: TItem) => React.ReactNode, 
  classNmae?: string
}

export default function DeleteListItem<TItem extends ListItemData<TId>, TId extends string | number = string>({
  item,
  onDelete,
  renderContent, 
  classNmae
}: Props<TItem, TId>) {
  return(
    <div 
    className={cn("flex w-full h-12 bg-gray-300 rounded-2xl items-center relative", classNmae)}>
      <button 
      className="w-8 h-8 bg-red-400 text-lg text-white font-semibold rounded-full absolute left-4"
      onClick={() => onDelete(item.id)}
      >
        ー
      </button>
      <div className="flex-grow text-center font-bold text-lg px-12">
        {renderContent(item)}
      </div>
    </div>
  );
}