import useSWR from 'swr';
import fetcher from '@/uitls/fetcher';

type apiPerson = {
  person_id: string,
  person_name: string
}

export default function usePerson() {
  const {data: responsePerson, error, isLoading, mutate} = useSWR<apiPerson[]>(process.env.NEXT_PUBLIC_BASE_API_URL + "person", fetcher);

  return {
    responsePerson, 
    error, 
    isLoading,
    mutatePersons: mutate // mutate 関数を外に公開
  }
}