import React, { useEffect, useState } from 'react';
import colors from 'github-colors';
import PropTypes from 'prop-types';

import { Container, User, Summary, Usage, Language, Stats, Link } from './styles';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com'
});

export default function GithubSumary({ login, cachedData, afterFetch }) {
  const [selected, setSelected] = useState('');

  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      if (cachedData) {
        return setUser(cachedData.user);
      }
      const { data } = await api.get(`/users/${login}`);
      setUser(data);
    })();
  }, [cachedData, login]);
  
  const [repos, setRepos] = useState([]);
  useEffect(() => {
    (async () => {
      if (cachedData) {
        return setRepos(cachedData.repos);
      }
      const { data } = await api.get(`/users/${login}/repos`);
      setRepos(data);
    })();
  }, [cachedData, login]);

  /**
   * Calculate the use of wich programming language
   */
  const [usage, setUsage] = useState([]);
  useEffect(() => {
    (async () => {
      if (repos.length > 0) {
        if (cachedData) {
          return setUsage(cachedData.usage);
        }

        const data = [];

        for (const { name } of repos) {
          const { data: langs } = await api.get(
            `/repos/${login}/${name}/languages`
          );
  
          for(const [language, usage] of Object.entries(langs)) {
            if (typeof usage === 'number') {
              const entry = data.find(u => u.language === language);
  
              if (entry) {
                entry.usage += usage;
                continue;
              }
  
              const { color, aliases, ace_mode: name } = colors.get(language);
              data.push({
                language,
                usage,
                color,
                label: (() => {
                  if (name.length > 6) {
                    return aliases.sort((a, b) => a.length - b.length).shift()
                  }
                  return name;
                })(name)
              });
            }
          }
  
          const total_usage = data.reduce(
            (sum, entry) => sum + entry.usage, 0
          );
    
          setUsage(data.map(entry => {
            const { usage } = entry;
            return {
              ...entry,
              usage: (usage / total_usage * 100).toPrecision(2)
            };
          }));
        }
      }
    })();
  }, [cachedData, login, repos]);

  /**
   * Sum all repos' commits
   */
  const [commits_averange, setCommitAverange] = useState(0);
  useEffect(() => {
    (async () => {
      if (repos.length > 0) {
        if (cachedData) {
          return setCommitAverange(cachedData.commits_averange);
        }

        let sum = 0;

        for (const { name } of repos) {
          const { data: commits, headers } = await api.get(
            `/repos/${login}/${name}/commits`
          );
  
          if (typeof headers.link === 'string') {
            const link = headers.link.split(',').pop();
            const page_url = new URL(link.match(/<(.*)>/).pop());
  
            if (page_url.searchParams.has('page')) {
              sum += (page_url.searchParams.get('page') - 1) * 30;
            }
  
            const { data: last_commits } = await api.get(page_url);
            sum += last_commits.length;
            continue;
          }
          sum += commits.length;
        }
        setCommitAverange(Math.floor(
          (sum / repos.length) * 10) / 10
        );
      }
    })();

  }, [cachedData, login, repos]);

  /**
   * Get commits from last week of each repo
   */
  const [recent_commits, setRecentCommits] = useState(null);
  useEffect(() => {
    (async () => {
      if (repos.length > 0) {
        if (cachedData) {
          return setRecentCommits(cachedData.recent_commits);
        }

        let commits = 0;
        let repositories = 0;

        for (const { name } of repos) {
          const { data: weeks } = await api.get(
            `/repos/${login}/${name}/stats/participation`
          );

          const week_commits_total = weeks.owner.pop();
          if (week_commits_total > 0) {
            commits += week_commits_total;
            repositories += 1;
          }
        }

        setRecentCommits({ commits, repositories });
      }
    })();
  }, [cachedData, login, repos]);

  /**
   * Retrieve issues closed in the last 30 days
   */
  const [issues_closed, setIssuesClosed] = useState(null);
  useEffect(() => {
    (async () => {
      if (repos.length > 0) {
        if (cachedData) {
          return setIssuesClosed(cachedData.issues_closed);
        }

        let issues = 0;
        let repositories = 0;

        for (const { name } of repos) {
          const date = new Date();
          date.setDate(date.getDate() - 30);
  
          const { data: closed, headers } = await api.get(
            `/${login}/${name}/issues`,
            {
              params: {
                state: 'closed',
                since: date.toISOString(),
              },
            }
          );
  
          if (typeof headers.link === 'string') {
            const link = headers.link.split(',').pop();
            const page_url = new URL(link.match(/<(.*)>/).pop());

            if (page_url.searchParams.has('page')) {
              issues += (page_url.searchParams.get('page') - 1) * 30;
            }

            const { data: last_issues } = await api.get(page_url);
            issues += last_issues.length;
            repositories += 1;
            continue;
          }

          if (closed.length > 0) {
            issues += closed.length;
            repositories += 1;
          }
        }
        setIssuesClosed({ issues, repositories });
      }
    })();
  }, [cachedData, login, repos]);

  useEffect(() => {
    if (typeof afterFetch === 'function') {
      const data = {
        user, repos, usage, commits_averange, recent_commits, issues_closed
      };

      for(const [, entry] of Object.entries(data)) {
        if ((Array.isArray(entry) && entry.length === 0)
        || !entry) {
          return;
        }
      }

      afterFetch(data);
    }
  }, [user, repos, usage, commits_averange, recent_commits, issues_closed, afterFetch]);

  return (
    <Container>
      <User>
        {user && <img src={user.avatar_url} alt={user.name} />}
        <Summary>
          {usage && <Usage>
            {usage.map(({ language, label, usage, ...rest }) => (
              <Language
                key={language}
                usage={usage}
                selected={selected === language}
                onClick={() => setSelected(language === selected ? '' : language)}
                {...rest}
              >
                {label}
                <span>{usage}%</span>
              </Language>
            ))}
          </Usage>}
          <Stats>
            {commits_averange > 0 && <div>
              <span>Commit<br/>Averange</span>
              {commits_averange < 10 ? `0${commits_averange}` : commits_averange}
              <span>
                in {repos.length} {repos.length > 1 ? 'repos' : 'repo'}
              </span>
            </div>}

            {recent_commits && <div>
              <span>Commits in<br />last 7 days</span>
              {recent_commits.commits < 10 ? `0${recent_commits.commits}` : recent_commits.commits}
              <span>
                in {recent_commits.repositories} {recent_commits.repositories > 1 ? 'repos' : 'repo'}
              </span>
            </div>}

            {issues_closed && <div>
              <span>Issues closed<br />in last 30 days</span>
              {issues_closed.issues < 10 ? `0${issues_closed.issues}` : issues_closed.issues}
              <span>
                in {issues_closed.repositories} {issues_closed.repositories > 1 ? 'repos' : 'repo'}
              </span>
            </div>}
          </Stats>
          <Link
            href={`https://github.com/${login}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View Profile
          </Link>
        </Summary>
      </User>
    </Container>
  );
}

GithubSumary.propTypes = {
  login: PropTypes.string.isRequired,
  cachedData: PropTypes.shape({
    user: PropTypes.shape({
      
    })
  })
};