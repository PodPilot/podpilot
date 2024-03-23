import { useState } from 'react';

export default function Input() {
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.value.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };

  return (
    <div className=" w-1/2 z-30 fixed bottom-0 p-5">
      <div className="input-group">
        <input
          type="text"
          className="input input-primary w-full"
          placeholder="Type your message..."
          onChange={handleInputChange}
        />
        <button className="btn btn-square">
          Send
        </button>
      </div>
    </div>
  );
}
