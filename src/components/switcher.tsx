"use client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props = {
    leftText: string;
    leftLink: string;
    rightText: string;
    rightLink: string;
    focus: "left" | "right";
    className?: string
};

const Switcher = ({ leftText, leftLink, rightText, rightLink, focus, className }: Props) => {
    const router = useRouter();
    
    return(
    <div className={cn("w-3/4", className)}>
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