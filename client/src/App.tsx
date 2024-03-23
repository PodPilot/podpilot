import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="prose">
      <h1 > Hello world! </h1>
      <button className="btn" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
}

export default App
