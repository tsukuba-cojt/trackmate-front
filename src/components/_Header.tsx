'use client'; // クライアントコンポーネントとしてマーク

import React, { useState } from 'react'; // useStateをインポート
import HamburgerButton from '@/components/HamburgerButton'; // HamburgerButtonコンポーネントをインポート
import { Sidebar } from '@/components/Sidebar'; // Sidebarコンポーネントをインポート
// import HamburgerIcon from '@/assets/hamburger-menu-svgrepo-com.svg'; // Headerコンポーネントでは直接使用しないため不要
// import Header from '@/components/Header'; // 自己参照インポートのため不要

// Headerコンポーネントのプロパティの型定義
interface HeaderProps {
  title: string; // ヘッダーに表示するタイトルを受け取る
}

// Headerコンポーネントを関数コンポーネントとして定義し、propsを正しく受け取る
export default function Header({ title }: HeaderProps) {
  // サイドバーの表示状態を管理するstate
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // サイドバーの表示・非表示を切り替える関数
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // 複数の要素をReact Fragment (<>...</>) でラップします
    <div>
      {/* ハンバーガーボタン */}
      <HamburgerButton onClick={toggleSidebar} />

      {/* サイドバーコンポーネント */}
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* ヘッダーのタイトル部分 */}
      {/* items-center に修正し、適切なスタイリングを追加 */}
      <div className="h-24 w-full flex items-center justify-end pr-8 pl-28 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
    </div>
  );
}