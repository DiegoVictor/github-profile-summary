import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { createGlobalStyle } from 'styled-components';
import GithubSummary from './components/GithubSummary';

const Style = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0px;
  }
`;

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

(async username => {
  const { data: user } = await api.get(`/users/${username}`);
  const { data: repos } = await api.get(`/users/${username}/repos`);

  const usage = {};
  let commits_count = 0;
  const week = { commits: 0, repos: 0 };
  const closed = {
    issues: 0,
    repos: 0,
    since: (date => {
      date.setDate(date.getDate() - 30);
      return date.toISOString();
    })(new Date()),
  };

  for (const { name: repo } of repos) {
    /**
     * Calculate the use of wich programming language
     */
    const { data: langs } = await api.get(
      `/repos/${username}/${repo}/languages`
    );
    Object.keys(langs).forEach(lang => {
      if (typeof langs[lang] === 'number') {
        let value = langs[lang];

        if (typeof usage[lang] === 'number') {
          value += usage[lang];
        }

        usage[lang] = value;
      }
    });

    /**
     * Sum all repos' commits
     */
    const response = await api.get(`/repos/${username}/${repo}/commits`);
    if (
      response.data.length === 30 &&
      typeof response.headers.link === 'string'
    ) {
      const page_url = new URL(
        (url => url.match(/<(.*)>/).pop())(
          response.headers.link.split(',').pop()
        )
      );

      if (page_url.searchParams.has('page')) {
        commits_count += (page_url.searchParams.get('page') - 1) * 30;
      }

      const { data: commits } = await api.get(page_url);
      commits_count += commits.length;
    } else {
      commits_count += response.data.length;
    }

    /**
     * Get commits from last week of each repo
     */
    const { data: weeks } = await api.get(
      `/repos/${username}/${repo}/stats/participation`
    );

    const commits_total = weeks.owner.pop();
    if (commits_total > 0) {
      week.commits += commits_total;
      week.repos += 1;
    }

    /**
     * Retrieve issues closed in the last 30 days
     */
    const { data: issues, headers } = await api.get(
      `/${username}/${repo}/issues`,
      {
        params: {
          state: 'closed',
          since: closed.since,
        },
      }
    );
    if (issues.length === 30 && typeof headers.link === 'string') {
      const page_url = new URL(
        (url => url.match(/<(.*)>/).pop())(headers.link.split(',').pop())
      );

      if (page_url.searchParams.has('page')) {
        closed.issues += (page_url.searchParams.get('page') - 1) * 30;
      }

      const { data } = await api.get(page_url);
      closed.issues += data.length;
      closed.repos += 1;
    } else if (issues.length > 0) {
      closed.issues += issues.length;
      closed.repos += 1;
    }
  }

  const stats = [
    {
      key: 'commit-averange',
      description: 'Commit\nAverange',
      value: Math.floor((commits_count / repos.length) * 10) / 10,
      repos: repos.length,
    },
    {
      key: 'commits-in-last-7-days',
      description: 'Commits in\nlast 7 days',
      value: week.commits,
      repos: week.repos,
    },
    {
      key: 'issues-closed-in-last-30-days',
      description: 'Issues closed\nin last 30 days',
      value: closed.issues,
      repos: closed.repos,
    },
  ];

  const total = Object.values(usage).reduce((sum, value) => sum + value, 0);

  Object.keys(usage).forEach(key => {
    const percent = (usage[key] / total) * 100;
    usage[key] = percent.toPrecision(2);
  });

  ReactDOM.render(
    <>
      <Style />
      <GithubSummary user={user} usage={usage} stats={stats} />
    </>,
    document.getElementById('root')
  );
})('DiegoVictor');
