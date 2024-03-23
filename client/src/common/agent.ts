const BASE_URL = 'http://localhost:3000';

export interface QueryResponse {
  response: string;
  suggestions: string[];
}

export const sendQuery = async (
  query: string
): Promise<QueryResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e.message);
    return {
      response: `There was an error! ${e.message}`,
      suggestions: [],
    };
  }
};
