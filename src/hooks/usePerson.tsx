import useSWR from 'swr';

type apiPerson = {
  person_id: string,
  person_name: string
}

const fetchPerson = async (url: string) => {
  const token = process.env.NEXT_PUBLIC_TOKEN;

  const res = await fetch(url, {
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    throw new Error(errorData.message || 'Failed to fetch person data');
  }

  return res.json();
}

export default function usePerson() {
  const {data: responsePerson, error, isLoading, mutate} = useSWR<apiPerson[]>(process.env.NEXT_PUBLIC_BASE_API_URL + "person", fetchPerson);

  return {
    responsePerson, 
    error, 
    isLoading,
    mutatePersons: mutate // mutate 関数を外に公開
  }
}