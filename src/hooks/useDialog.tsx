import { useState, useCallback } from 'react';
import React from 'react'; // errorMessageがJSXを受け取る場合があるのでインポート

// フックが返す値の型定義
type UseDialogReturn = {
  dialogProps: {
    isOpen: boolean;
    onClose: () => void;
    errorMessage: React.ReactNode;
    imgPath: string;
  };
  openDialog: (message: string, imagePath: string) => void;
  forceCloseDialog: () => void;
};

export default function useDialog(): UseDialogReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imgPath, setImgPath] = useState<string>("");

  const openDialog = useCallback((message: string, imagePath: string) =>  {
    setIsOpen(true);
    setErrorMessage(message);
    setImgPath(imagePath);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false); 
    setErrorMessage("");
    setImgPath("");
  }, []);

  return ( {
    dialogProps: {
      isOpen: isOpen,
      onClose: closeDialog, // ここで上で定義した閉じる関数を渡します
      errorMessage: errorMessage,
      imgPath: imgPath,
    },
    openDialog: openDialog, // ダイアログを開くための関数
    forceCloseDialog: closeDialog,
    }
  );
}
