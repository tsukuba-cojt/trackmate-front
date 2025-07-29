import { ChangeEvent } from "react";
import { Input } from "./ui/input";

type Props = {
  newValue: string, 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onAddClick: (newValue: string) => void
}

export default function ButtonAndInputForm({
  newValue, 
  onChange,
  onAddClick,
}: Props) {
  return (
    <div className="flex w-full h-12 bg-white rounded-2xl items-center relative border border-dashed border-black">
      <button 
        className="w-8 h-8 bg-green-400 text-lg text-white font-semibold rounded-full absolute left-4" 
        onClick={() => onAddClick(newValue)}
      >
        ＋
      </button>
      <Input 
        className="flex-grow text-center font-bold text-lg outline-none border-none h-full px-12 
        focus-visible:ring-0 focus-visible:ring-offset-0 
        focus:ring-0 focus:ring-offset-0 
        aria-invalid:ring-0 aria-invalid:ring-offset-0"
        placeholder="名前を入力"
        value={newValue}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}