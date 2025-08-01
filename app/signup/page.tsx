"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TransitionButton from "@/components/transition";
// Firebase関連のインポートは削除
// import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import { auth } from '@/components/auth/firebase';
// Axiosのインポートは削除 (fetchを使用するため)
// import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const signupPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // バックエンドのユーザー登録APIエンドポイント
    // 実際のバックエンドのURLに合わせて変更してください
    const signupApiUrl = "http://localhost:3401/auth/signup"; // 開発用 (例)
    // const signupApiUrl = "/api/signup"; // 本番環境用 (Next.js API Routesを使用する場合)

    const handlesignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setIsLoading(true);

        try {
            // バックエンドAPIへのユーザー登録情報送信
            const response = await fetch(signupApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 登録成功
                console.log('ユーザー登録が完了し、バックエンドに情報が送信されました');
                setSuccessMessage("会員登録が完了しました。ログインページへ移動します。");
                // 登録成功後、一定時間後にログインページへリダイレクト
                setTimeout(() => {
                    router.push('/login');
                }, 2000); // 2秒後にリダイレクト
            } else {
                // 登録失敗 (バックエンドからのエラーメッセージをパース)
                const errorDetail = data.message || '不明なエラーが発生しました。';
                setErrorMessage(`会員登録エラー: ${errorDetail}`);
                console.error('サインアップ中に問題が発生しました:', data);
            }

        } catch (error: unknown) {
            // ネットワークエラーなど、予期せぬエラー
            console.error('サインアップ中にネットワークまたは予期せぬエラーが発生しました:', error);
            if (error instanceof Error) {
                setErrorMessage(`ネットワークエラー: ${error.message}`);
            } else {
                setErrorMessage('サインアップ中に不明なエラーが発生しました。');
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
                        rightLink="/signup"
                        focus="right"
                    />
                </div>
                <form onSubmit={handlesignup}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            {isLoading ? '登録中...' : '会員登録'}
                        </button>
                    </div>
                </form>

                {/* 成功メッセージの表示 */}
                {successMessage && (
                    <Alert variant="default" className="mt-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>
                            登録に成功しました!
                        </AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                {/* エラーメッセージの表示 */}
                {errorMessage && (
                    <Alert variant="destructive" className="mt-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>
                            登録に失敗しました。
                        </AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default signupPage;