import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Display() {

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="text-2xl font-bold my-4">
        貸し / 借り
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-4">
        <Card className="w-3/4">
          <CardContent className="">
            <div>やすの</div>
            <div className="flex justify-end text-4xl">¥ 1,500</div>
          </CardContent>
        </Card>

        <Card className="w-3/4">
          <CardContent className="">
            <div>Astalum</div>
            <div className="flex justify-end text-4xl">¥ 1,300</div>
          </CardContent>
        </Card>

        <Card className="w-3/4">
          <CardContent className="">
            <div>こまつさん</div>
            <div className="flex justify-end text-4xl">¥ 20,300</div>
          </CardContent>
        </Card>
      </div>

      </div>
  );
}