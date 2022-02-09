import { Channel } from "./channel";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="App">
        <Channel />
      </div>
    </QueryClientProvider>
  );
}

export default App;
