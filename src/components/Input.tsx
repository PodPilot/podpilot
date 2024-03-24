export default function Input({
  input,
  setInput,
  handleSubmit,
  disabled,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  disabled: boolean;
}) {
  return (
    <footer className="footer flex justify-center w-full p-5">
      <form className="form-control w-4/5" onSubmit={handleSubmit}>
        <label className="input input-primary flex items-center gap-2 w-full">
          <input
            type="text"
            className="grow"
            placeholder="Type your message..."
            disabled={disabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            />
          </svg>
        </label>
      </form>
    </footer>
  );
}
