import { ProfileSummary } from "@diegovictor/github-profile-summary";

import data from "./data.json";

function App() {
  return (
    <div className="App" style={{ height: "100vh", flex: 1 }}>
      <ProfileSummary data={data} />
    </div>
  );
}

export default App;
