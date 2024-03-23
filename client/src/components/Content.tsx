import { ReactElement, useState } from 'react';
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

  const handleInputSubmit = async (e) => {
    console.log(`submitting: ${e.target[0].value}`);
    e.preventDefault();

    const newMessage: UserMessage = {
      content: e.target[0].value,
      role: 'user',
    };

    setConversation([...conversation, newMessage]);

    e.target.reset();
  };

  return (
    <div className="drawer-content">
      {/* Button for expanding the side panel on smaller screens */}
      <label
        htmlFor="my-drawer-2"
        className="btn btn-primary drawer-button lg:hidden"
      >
        Open drawer
      </label>

      <div className="w-full h-[90vh] flex flex-col space-y-2 overflow-auto bg-base-200 md:[overflow-anchor:none]">
        {/* Conversation Panel */}
        {conversation.map((message) =>
          message.role === 'user'
            ? renderUserMessage(message as UserMessage)
            : renderPilotContent(message as PilotMessage)
        )}

        {/* forces scroll to anchor to bottom of content area */}
        <div id="anchor" className="md:[overflow-anchor:auto] h-px" />
      </div>
      <Input handleSubmit={handleInputSubmit} />
    </div>
  );
}
