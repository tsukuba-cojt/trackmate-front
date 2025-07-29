type ListItemData<TId extends string | number = string> = {
  id: TId
}

type Props<TItem extends ListItemData<TId>, TId extends string | number = string> = {
  item: TItem, 
  onDelete: (deletedItemId: TId) => void, 
  renderContent: (item: TItem) => React.ReactNode
}

export default function DeleteListItem<TItem extends ListItemData<TId>, TId extends string | number = string>({
  item,
  onDelete,
  renderContent
}: Props<TItem, TId>) {
  return(
    <div 
    className="flex w-full h-12 bg-gray-300 rounded-2xl items-center relative">
      <button 
      className="w-8 h-8 bg-red-400 text-lg text-white font-semibold rounded-full absolute left-4"
      onClick={() => onDelete(item.id)}
      >
        ー
      </button>
      <p className="flex-grow text-center font-bold text-lg px-12">
        {renderContent(item)}
      </p>
    </div>
  );
}