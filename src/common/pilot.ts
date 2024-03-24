const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sugamxp--example-langchain-qanda-web-runner-dev.modal.run'
    : 'http://localhost:3000';

export interface QueryResponse {
  answer: string;
  suggestions: string[];
}

export const sendQuery = async ({
  query,
  context,
}: {
  query: string;
  context: string[];
}): Promise<QueryResponse> => {
  try {
    console.log(`sending query: ${query}`);
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        context,
      }),
    });

    let data = await res.json();

    if (!data.suggestions) {
      data = {
        ...data,
        suggestions: [
          'Donald Glover',
          'Data Engineering',
          'Intermittent Fasting',
        ],
      };
    }

    return data;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown Error!';
    console.error(message);
    return {
      answer: `There was an error! ${message}`,
      suggestions: [],
    };
  }
};
