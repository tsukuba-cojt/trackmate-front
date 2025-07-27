import { HttpError } from '@/uitls/HttpError';

export default async function fetcher(url: string){
  const token = process.env.NEXT_PUBLIC_TOKEN;

  const res = await fetch(url, {
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const error = new HttpError('An error occurred while fetching the data.', res.status);
    throw error;
  }

  const data = await res.json();
  return data
}