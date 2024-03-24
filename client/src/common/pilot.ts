const BASE_URL =
  // 'https://sugamxp--example-langchain-qanda-web-dev.modal.run';
  'http://localhost:3000';

export interface QueryResponse {
  answer: string;
  suggestions: string[];
}

export const sendQuery = async (
  query: string
): Promise<QueryResponse> => {
  try {
    const url = `${BASE_URL}?query=${encodeURIComponent(query)}`;

    console.log(`hitting ${url}`);
    const res = await fetch(url);

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
    console.error(e.message);
    return {
      answer: `There was an error! ${e.message}`,
      suggestions: [],
    };
  }
};
