import { Button } from "@/components/ui/button";

export default function Input() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>

      <div className="flex gap-6">
        <Button variant="outline" className="border-black text-2xl font-bold border-1 px-12 py-6">貸し</Button>
        <Button variant="outline" className="border-black text-2xl font-bold border-1 px-12 py-6">借り</Button>
      </div>

    </div>
  );
}