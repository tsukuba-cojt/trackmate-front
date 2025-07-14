type Person = {
  id: string, 
  name: string
}

type Props = {
  person: Person, 
  onDelete: () => void
}

export default function PersonListItem({
  person,
  onDelete
}: Props) {
  return(
    <div 
    className="flex w-full h-12 bg-gray-300 rounded-2xl items-center relative">
      <button 
      className="w-8 h-8 bg-red-400 text-lg text-white font-semibold rounded-full absolute left-4"
      onClick={() => onDelete()}
      >
        ー
      </button>
      <p className="flex-grow text-center font-bold text-lg px-12">
        {person.name}
      </p>
    </div>
  );
}