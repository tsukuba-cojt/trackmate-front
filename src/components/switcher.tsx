import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props = {
  leftText: string;
  leftLink: string;
  rightText: string;
  rightLink: string;
  focus: "left" | "right";
};

const Switcher = ({ leftText, leftLink, rightText, rightLink, focus }: Props) => {
  const router = useRouter();

  return (
    <div className="w-3/4 px-8 py-10">
      <Button
        variant={focus === "left" ? "ghost" : "link"}
        className={`w-1/2 border-b-2 ${focus === "left" ? "border-focus-100 text-focus-100" : "border-focus-200 text-focus-200"} shadow-none rounded-none mb-4 font-bold text-xl`}
        onClick={() => {
          router.push(leftLink);
        }
        }
      >
        {leftText}
      </Button>
      <Button
        variant={focus === "right" ? "ghost" : "link"}
        className={`w-1/2 border-b-2 ${focus === "right" ? "border-focus-100 text-focus-100" : "border-focus-200 text-focus-200"} shadow-none rounded-none mb-4 font-bold text-xl`}
        onClick={() => {
          router.push(rightLink);
        }
        }
      >
        {rightText}
      </Button>
    </div>
  )
}

export default Switcher;