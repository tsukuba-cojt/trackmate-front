import useSWR from 'swr';
import fetcher from '@/uitls/fetcher';

type ApiPerson = {
  person_id: string,
  person_name: string
}

export default function usePerson() {
  // @ts-expect-error
  const {data: responsePerson,  error, isLoading, mutate} = useSWR<ApiPerson[]>(process.env.NEXT_PUBLIC_BASE_API_URL + "person", fetcher);

  console.log(responsePerson)

  return {
    responsePerson, 
    error, 
    isLoading,
    mutatePersons: mutate // mutate 関数を外に公開
  }
}