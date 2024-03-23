import { ReactElement, useEffect, useState, useRef } from 'react';
import Input from './Input';
import { sendQuery } from '../common/pilot';

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

const pilotLine = (text: string) => (
  <article className="font-serif prose prose-lg">
    <p>{text}</p>
  </article>
);

const firstMessages: PilotMessage[] = [
  {
    role: 'pilot',
    content: (
      <article className="font-serif prose">
        <h2>Welcome to PodPilot</h2>
      </article>
    ),
  },
  {
    role: 'pilot',
    content: pilotLine('What are you looking to learn today?'),
  },
];

const renderPilotContent = (message: PilotMessage) => {
  return message.content;
};

const renderSuggestions = (suggestions: string[]) => (
  <div className="flex flex-row justify-start justify-items-center space-x-4">
    {suggestions.map((suggestion, idx) => (
      <div
        className="card w-32 h-32 bg-base-100 shadow"
        onClick={console.log}
        key={idx}
      >
        <h2 className="font-serif prose prose-sm card-title">
          {suggestion}
        </h2>
      </div>
    ))}
  </div>
);

const renderUserMessage = (message: UserMessage) => {
  return (
    <div className="chat chat-end">
      <div className="chat-bubble">{message.content}</div>
    </div>
  );
};

export default function Content() {
  const [conversation, setConversation] =
    useState<IContent[]>(firstMessages);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>();

  const container = useRef<HTMLDivElement>(null);

  const scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } =
      container.current as HTMLDivElement;
    console.log(offsetHeight, scrollHeight, scrollTop);
    if (scrollHeight >= scrollTop + offsetHeight + 100) {
      container.current?.scrollTo(0, scrollHeight);
      console.log('scrolled!');
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
        const queryResponse = await sendQuery(
          (lastMessage as UserMessage).content
        );
        setLoading(false);

        const pilotResponse: PilotMessage = {
          role: 'pilot',
          content: pilotLine(queryResponse.response),
        };

        setConversation([...conversation, pilotResponse]);
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
