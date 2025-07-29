"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TransitionButton from "@/components/transition";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/components/auth/firebase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        try {
            // Firebase Authenticationでメールアドレスとパスワードを使ってログイン
            await signInWithEmailAndPassword(auth, email, password);
            console.log('ログイン成功！');
            router.push('/loan/display');
        } catch (error: unknown) {
            console.error('ログイン中に問題が発生しました:', error);
            if (error instanceof Error) {
                setErrorMessage(`ログインエラー: ${error.message}`);
            } else {
                setErrorMessage('ログイン中に不明なエラーが発生しました。');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-theme-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="px-8 py-2 mb-4">
                    <TransitionButton
                        leftText="ログイン"
                        leftLink="/login"
                        rightText="会員登録"
                        rightLink="/register"
                        focus="left"
                    />
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email} // Controlled component
                            onChange={(e) => setEmail(e.target.value)} // Controlled component
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <button
                            type="submit"
                            className="w-3/4 bg-theme-200 text-white mt-4 py-3 rounded hover:bg-blue-700 transition duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </div>
                </form>

                {errorMessage && (
                    <Alert variant="destructive" className="mt-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>ログイン失敗</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}

export default LoginPage;