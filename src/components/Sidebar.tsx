import React from 'react';
import Link from 'next/link'; // Next.jsのLinkコンポーネントをインポート
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'; // SheetHeader, SheetTitle, SheetDescriptionを再追加
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// アイテムの型定義
interface Item { // typeではなくinterfaceを使用 (好みによるが、Shadcn UIの例に合わせる)
  title: string;
  url: string;
}

// SidebarPropsの型定義
type SidebarProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Sidebar({ isOpen, onOpenChange }: SidebarProps) {

  const items: Item[] = [
    {
      "title": "支出",
      "url": "/expense/display", // typo修正: expence -> expense (先頭にスラッシュを追加)
    },
    {
      "title": "貸し借り", // 以前の会話で「貸借」は「貸し借り」に修正済み
      "url": "/loan/display",
    },
    {
      "title": "支出記録", // 以前の会話で「支出記録」は「記録確認」に修正済み
      "url": "/record/display", // typo修正: records -> record (先頭にスラッシュを追加)
    }
  ];

  const itemsSetting: Item[] = [
    {
      "title": "予算設定",
      "url": "/settings/budget", // typo修正: setting -> settings (先頭にスラッシュを追加)
    },
    {
      "title": "カテゴリ設定",
      "url": "/settings/category",
    },
    {
      "title": "貸借相手設定",
      "url": "/settings/partners", // 以前の会話で「貸借相手設定」はsettings/partnersに修正済み (先頭にスラッシュを追加)
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-4 flex flex-col">
        {/* SheetHeaderコンポーネントを使用してタイトルを構造化 */}
        <SheetHeader>
          <SheetTitle>Track Mate Menu</SheetTitle>
          <SheetDescription>
            家計簿アプリのメニュー
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-2 flex-grow mt-4"> {/* 上部のマージンを追加 */}
          {items.map((item) => (
            <Link key={item.url} href={item.url} passHref legacyBehavior>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onOpenChange(false)} // クリックでサイドバーを閉じる
              >
                {item.title}
              </Button>
            </Link>
          ))}

          {/* ドロップダウンメニュー */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start mt-4">各種設定</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>設定項目</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {itemsSetting.map((itemSetting) => (
                <Link key={itemSetting.url} href={itemSetting.url} passHref legacyBehavior>
                  <DropdownMenuItem onClick={() => onOpenChange(false)}>
                    {itemSetting.title}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
