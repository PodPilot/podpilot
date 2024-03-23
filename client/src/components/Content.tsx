import Input from './Input';

export default function Content() {
  return (
    <>
        <div className="flex flex-col polka  items-center justify-around px-6 py-3 pb-16 xl:pr-2 bg-base-200   min-h-screen">
          <div className="w-full space-y-2 shadow-md">
            <div className="w-full bg-base-100 px-3 py-3">
              <p className="leading-6 p-2">
                To add an icon inside the input element, you can use the
                InputGroup component from the Tailwind CSS framework. You'll
                need to import the necessary icons from a library like
                Heroicons. First, install heroicons (if you haven't already)
                by running:
              </p>
              <pre>
                <div className="bg-black rounded-md mb-4">
                  <div className="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                    <span>bash</span>
                    <button className="flex ml-auto gap-2">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect
                          x="8"
                          y="2"
                          width="8"
                          height="4"
                          rx="1"
                          ry="1"
                        ></rect>
                      </svg>
                      Copy code
                    </button>
                  </div>
                  <div className="p-4 overflow-y-auto">
                    <code className="!whitespace-pre hljs language-bash">
                      npm install @heroicons/react
                    </code>
                  </div>
                </div>
              </pre>
            </div>
          </div>
        </div>
        <Input />
      </>
    );
  }
