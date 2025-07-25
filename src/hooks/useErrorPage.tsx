import { useCallback, useState } from "react";

type ReturnUseErrorPage = {
  displayErrorPage: {statusCode: number, message: string} | null, 
  showErrorPage: ((statusCode: number, message:string) => void), 
  hideErrorPgae: () => void
} 

export default function useErrorPage(): ReturnUseErrorPage {
  const [displayErrorPage, setDisplayErrorPage] = useState<{statusCode: number, message: string} | null>(null);

  const showErrorPage = useCallback((statusCode: number, message:string) => {
    setDisplayErrorPage({statusCode: statusCode, message: message});
  }, [])

  const hideErrorPgae = useCallback(() => {
    setDisplayErrorPage(null);
  }, [])

  return ({
    displayErrorPage, 
    showErrorPage, 
    hideErrorPgae, 
  })
}