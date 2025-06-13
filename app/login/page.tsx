import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center h-screen bg-theme-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="px-8 py-2 mb-4">
                    <Button
                    variant="ghost"
                    className="w-1/2 border-b border-focus-100 text-focus-100 shadow-none rounded-none mb-4"
                    // onClick={() => {
                    //     // Handle Google login
                    // }
                    // }
                    >
                    ログイン
                    </Button>
                    <Button
                    variant="ghost"
                    className="w-1/2 border-b border-focus-200 text-focus-200 shadow-none rounded-none mb-4"
                    // onClick={() => {
                    //     // Handle GitHub login
                    // }
                    // }
                    >
                    会員登録
                    </Button>
                </div>
                <form>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">
                    ユーザーID
                    </label>
                    <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" htmlFor="password">
                    パスワード
                    </label>
                    <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                <div className="flex items-center justify-center mb-4">
                    <button 
                        type="submit"
                        className="w-3/4 bg-theme-200 text-white mt-4 py-3 rounded hover:bg-blue-700 transition duration-200"
                    >
                        ログイン
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
    }