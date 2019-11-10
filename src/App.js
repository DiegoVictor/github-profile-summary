import React from 'react';
import GithubSummary from './GithubSummary';
import data from './data';

localStorage.setItem('github_summary', JSON.stringify(data));

function App() {
  return (
    <GithubSummary
      login="DiegoVictor"
      cachedData={JSON.parse(localStorage.getItem('github_summary'))}
      afterFetch={data => {
        localStorage.setItem('github_summary', JSON.stringify(data));
      }}
    />
  );
}

export default App;
