'use client';

import React, { useState, useEffect } from 'react';
import HamburgerIcon from '@/assets/hamburger-menu-svgrepo-com.svg';
import HamburgerButton from '@/components/HamburgerButton';
import { Sidebar } from '@/components/Sidebar';
import Header from '@/components/_Header'

export default function Home() {
  // サイドバーの表示状態を管理するstate
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // サイドバーの表示・非表示を切り替える関数
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100 text-gray-900"> {/* 画面全体を覆うようにmin-h-screenと背景色を追加 */}
      {/* コンポーネント化したHamburgerButtonを使用し、onClickハンドラを渡します */}
      {/* HamburgerButton内でSVGが正しくレンダリングされているか確認してください */}
      {/* <HamburgerButton onClick={toggleSidebar} /> */}

      {/* サイドバーコンポーネント */}
      {/* isSidebarOpenの状態に基づいて表示・非表示が制御されます */}
      {/* <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} /> */}

      <Header title="貸し借り"/>

      <main className="flex-1 p-8 ml-20 bg-white shadow-lg rounded-lg"> {/* メインコンテンツのスタイリングを強化
        {/* <h1 className="text-3xl font-bold text-gray-800">メインコンテンツ</h1>
        <p className="mt-4 text-gray-700">ここにページのメインコンテンツが表示されます。</p>
        <p className="text-gray-700">サイドバーの表示・非表示を切り替えるには、左上のハンバーガーアイコンをクリックしてください。</p>
        <div className="mt-8 p-4 border border-blue-300 bg-blue-50 rounded-md text-blue-800">
          <p className="font-semibold">デバッグ情報:</p>
          <p>ハンバーガーアイコンが見えない場合や、ページが真っ白な場合は、ブラウザの開発者ツール (F12) を開き、Consoleタブを確認してください。</p>
          <p>特に `Element type is invalid` や `Module not found` エラーが出ていないか確認してください。</p>
          <p>また、`HamburgerButton.tsx` 内の `useEffect` でログを確認し、`Type of HamburgerIcon: function` と表示されているか確認してください。</p>
        </div> */}
      </main>
    </div>
  );
}