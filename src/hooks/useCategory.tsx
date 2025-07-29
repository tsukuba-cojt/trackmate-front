import fetcher from "@/uitls/fetcher";
import { HttpError } from "@/uitls/HttpError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

type ApiCategory = {
  category_id: string,
  category_name: string,
  sum: number
}

type Category = {
  id: string, 
  name: string, 
}

export default function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data, error, isLoading, mutate } = useSWR<ApiCategory[]>(process.env.NEXT_PUBLIC_BASE_API_URL + "categories", fetcher);

  useEffect(() => {
    if (data && data.data) {
      console.log(data.data);
      const newPersons = data.data.map((responsePersonItem: ApiCategory) => {
        return (
          {
            id: responsePersonItem.category_id, 
            name: responsePersonItem.category_name
          }
        )
      });
      setCategories(newPersons);
    }
  }, [data, error])

  return {
    categories, 
    setCategories, 
    error, 
    isLoading, 
    mutateCategories: mutate
  }
}