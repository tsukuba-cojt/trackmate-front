"use client";
import React from "react";
import { useRouter } from "next/navigation";
import TransitionButton from "@/components/transition";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase-auth'; 
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react";

const registerUser = async (email: string, password: string, displayName: string) => {
    try {
        // Firebase Authenticationへのユーザー登録とuidの取得
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUid = userCredential.user.uid;
        const registerApiUrl = 

        // 登録確認メールの送信
        await sendEmailVerification(userCredential.user);
        <Alert variant="default">
            <Terminal />
            <AlertTitle>メールを送信しました!</AlertTitle>
            <AlertDescription>
                登録確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
            </AlertDescription>
        </Alert>

        // backend-api(統合先)へのユーザー登録
        await axios.post('https://your-backend-api.com/signup', {
        firebaseUid: firebaseUid,
        email: email,
        name: displayName || "Unknown", 
    });

        console.log('User registered and data sent to backend');
    } catch (error) {
        console.error('Error during registration:', error);
    }
};

const RegisterPage = () => {
    const router = useRouter();
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

export default RegisterPage;