"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TransitionButton from "@/components/transition";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/components/auth/firebase';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const RegisterPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const registerApiUrl = "http://localhost:3006/api/signup"; // 開発用
    // const registerApiUrl = "/api/signup"; // 本番環境用

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setIsLoading(true);

        try {
            // 1. Firebase Authenticationへのユーザー登録
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUid = userCredential.user.uid;

            // 2. 登録確認メールの送信
            // sendEmailVerificationはユーザーがログイン状態でないと失敗する可能性があるので注意
            // 登録直後なのでuserCredential.userを使用
            await sendEmailVerification(userCredential.user);
            setSuccessMessage("登録確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。");

            // 3. バックエンドAPIへのユーザー登録情報送信
            await axios.post(registerApiUrl, {
                firebaseUid: firebaseUid,
                email: email,
            });

            console.log('ユーザー登録が完了し、バックエンドに情報が送信されました');

            // 4. 登録成功後のリダイレクト
            router.push('/login'); // 登録後にログインページへリダイレクト

        } catch (error: unknown) {
            console.error('サインアップ中に問題が発生しました:', error);
            if (error instanceof Error) {
                setErrorMessage(`サインアップ中にエラーが発生しました: ${error.message}`);
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
                        rightLink="/register"
                        focus="right"
                    />
                </div>
                <form onSubmit={handleRegister}>
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
                            onChange={(e) => setPassword(e.target.value)} // Controlled component
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <button
                            type="submit"
                            className="w-3/4 bg-theme-200 text-white mt-4 py-3 rounded hover:bg-blue-700 transition duration-200"
                            disabled={isLoading} // 送信中はボタンを無効化
                        >
                            {isLoading ? '登録中...' : '会員登録'} {/* ボタンテキストを動的に変更 */}
                        </button>
                    </div>
                </form>

                {/* 成功メッセージの表示 */}
                {successMessage && (
                    <Alert variant="default" className="mt-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>
                            登録に成功しました!
                            ログインページからログインしてください。
                        </AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                {/* エラーメッセージの表示 */}
                {errorMessage && (
                    <Alert variant="destructive" className="mt-4"> {/* エラー用にvariant="destructive"を使用 */}
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>
                            登録に失敗しました。
                            もう一度お試しください。
                        </AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;