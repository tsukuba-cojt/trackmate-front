import Switcher from "@/components/switcher";
import TransitionButton from "@/components/transition";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function main() {
    return (
        <div className="h-screen w-screen">
            <div className="w-screen py-10 bold text-4xl text-center">支出</div>
                <div className="flex justify-center mb-8">
                    <Switcher
                    leftText="表示"
                    leftLink="/expense/display"
                    rightText="入力"
                    rightLink="/expense/input"
                    focus="left"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <div className="w-5/6 grid grid-cols-2 gap-5 p-4 bg-white rounded-lg shadow-md">
                        <div className="col-span-2 border rounded-lg border-black">
                            <Card>
                            <CardHeader>
                                <CardTitle>使用金額</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <div className="text-4xl">10,000<span className="text-xl ml-2">円</span></div>
                            </CardContent>
                            </Card>
                        </div>
                        <div className="border rounded-lg border-black">
                            <Card>
                            <CardHeader>
                                <CardTitle className="text-s">今月の予算</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <div className="text-xl">10,000<span className="text-xs ml-1">円</span></div>
                            </CardContent>
                            </Card>
                        </div>
                        <div className="border rounded-lg border-black">
                            <Card>
                            <CardHeader>
                                <CardTitle>今月の残額</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <div className="text-xl">10,000<span className="text-xs ml-1">円</span></div>
                            </CardContent>
                            </Card>
                        </div>
                        <div className="border rounded-lg border-black">
                            <Card>
                            <CardHeader>
                                <CardTitle>負債</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <div className="text-xl">10,000<span className="text-xs ml-1">円</span></div>
                            </CardContent>
                            </Card>
                        </div>
                        <div className="border rounded-lg border-black">
                            <Card>
                            <CardHeader>
                                <CardTitle>貸し</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <div className="text-xl">10,000<span className="text-xs ml-1">円</span></div>
                            </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            <div>
                <transitionButton
                    leftText="カテゴリ別"
                    leftLink="/category"
                    rightText="予測グラフ"
                    rightLink="/graph"
                    focus="left"
                />
            </div>
        </div>
    );
}

export default main;