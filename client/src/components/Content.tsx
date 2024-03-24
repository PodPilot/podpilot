import { ReactElement, useEffect, useState, useRef } from 'react';
import Markdown from 'markdown-to-jsx';

import Input from './Input';
import { sendQuery } from '../common/pilot';
import TopicCard from './TopicCard';

interface IContent {
  role: 'user' | 'pilot';
}

interface UserMessage extends IContent {
  role: 'user';
  content: string;
}

interface PilotMessage extends IContent {
  role: 'pilot';
  content: ReactElement;
}

// render the main answer from pilot as markdown
const pilotLine = (text: string) => {
  return (
    <article className="font-serif prose prose-lg">
      <Markdown>{text}</Markdown>
    </article>
  );
};

const firstMessages: PilotMessage[] = [
  {
    role: 'pilot',
    content: (
      <article className="font-rosarivo prose">
        <h2>Welcome to PodPilot</h2>
      </article>
    ),
  },
  {
    role: 'pilot',
    content: pilotLine(
      "We've listened to BILLIONS of hours of podcast content 🎙️"
    ),
  },
  {
    role: 'pilot',
    content: pilotLine('What do you want to know?'),
  },
];

const renderPilotContent = (message: PilotMessage) => {
  return message.content;
};

const renderSuggestions = (suggestions: string[]) => (
  <div className="flex flex-row justify-start justify-items-center space-x-4">
    {suggestions.map((suggestion, idx) => (
      // TODO: update to pull label from suggestion
      <TopicCard
        key={idx}
        label={suggestion}
        query={suggestion}
        img={undefined}
      />
    ))}
  </div>
);

const renderUserMessage = (message: UserMessage) => {
  return (
    <div className="chat chat-end">
      <div className="chat-bubble prose prose-lg font-serif">
        {message.content}
      </div>
    </div>
  );
};

export default function Content() {
  // this holds the ready-to-render messages in the chat
  // probably can do a lift off of context instead
  const [conversation, setConversation] =
    useState<IContent[]>(firstMessages);

  // because I'm lazy I added a secondary data structure :shrug: sue me!
  // even indices are user queries, odd indices are pilot answers
  const [context, setContext] = useState<string[]>([]);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>();

  const container = useRef<HTMLDivElement>(null);

  const scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } =
      container.current as HTMLDivElement;
    if (scrollHeight >= scrollTop + offsetHeight + 100) {
      container.current?.scrollTo(0, scrollHeight);
    }
  };

  // whenever the conversation is updated, scroll to the bottom of the screen
  // TODO: may not be ideal UX when the pilot response is long
  useEffect(() => {
    scroll();
  }, [conversation]);

  // if last message was a user message, go get a response from our pilot
  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1];

    if (lastMessage.role === 'user') {
      setLoading(true);
      (async () => {
        const query = (lastMessage as UserMessage).content;
        const queryResponse = await sendQuery({
          query,
          context,
        });
        setLoading(false);

        const pilotResponse: PilotMessage = {
          role: 'pilot',
          content: pilotLine(queryResponse.answer),
        };

        setConversation([...conversation, pilotResponse]);
        setContext([...context, query, queryResponse.answer]);
        setSuggestions(queryResponse.suggestions);
      })();
    }
  }, [conversation]);

  // whenever suggestions are present, render them into a carousel of cards and clear them
  useEffect(() => {
    if (suggestions) {
      const pilotResponse: PilotMessage = {
        role: 'pilot',
        content: renderSuggestions(suggestions),
      };

      setConversation([...conversation, pilotResponse]);

      // clear suggestions for the next pilot response
      setSuggestions(undefined);
    }
  }, [suggestions]);

  const handleInputSubmit = async (e) => {
    const query = e.target[0].value;
    console.log(`submitting: ${query}`);

    e.preventDefault();
    e.target.reset();

    const userMessage: UserMessage = {
      role: 'user',
      content: query,
    };

    setConversation([...conversation, userMessage]);
  };

  return (
    <>
      {/* Button for expanding the side panel on smaller screens */}
      <label
        htmlFor="drawer"
        className="btn btn-primary drawer-button lg:hidden"
      >
        Open drawer
      </label>

      <div className="drawer-content bg-base-200">
        {/* Conversation Panel */}
        <div
          ref={container}
          className="w-full h-[calc(100vh-8rem)] flex flex-col space-y-2 overflow-auto py-10 px-24"
        >
          {conversation.map((message) =>
            message.role === 'user'
              ? renderUserMessage(message as UserMessage)
              : renderPilotContent(message as PilotMessage)
          )}
        </div>

        <Input
          handleSubmit={handleInputSubmit}
          disabled={isLoading}
        />
      </div>
    </>
  );
}
