import { ReactElement, useEffect, useState, useRef } from 'react';
import Input from './Input';

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

const firstMessage: PilotMessage = {
  role: 'pilot',
  content: (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title">Hello there</h1>
        <p>What would you like to learn about?</p>
      </div>
    </div>
  ),
};

const renderPilotContent = (message: PilotMessage) => {
  return message.content;
};

const renderUserMessage = (message: UserMessage) => {
  return (
    <div className="chat chat-end">
      <div className="chat-bubble">{message.content}</div>
    </div>
  );
};

export default function Content() {
  const [conversation, setConversation] = useState<IContent[]>([
    firstMessage,
  ]);
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

  useEffect(() => {
    scroll();
  }, [conversation]);

  const handleInputSubmit = async (e) => {
    console.log(`submitting: ${e.target[0].value}`);
    e.preventDefault();

    const newMessage: UserMessage = {
      role: 'user',
      content: e.target[0].value,
    };

    const pilotDummyResponse: PilotMessage = {
      role: 'pilot',
      content: (
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            I heard "{e.target[0].value}"
          </div>
        </div>
      ),
    };

    setConversation([
      ...conversation,
      newMessage,
      pilotDummyResponse,
    ]);

    e.target.reset();
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

        <Input handleSubmit={handleInputSubmit} />
      </div>
    </>
  );
}
