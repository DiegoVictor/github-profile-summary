const axios = require('axios');
const { createInterface } = require('readline');
const colors = require('github-colors');
const fs = require('fs');

const [, , userName, accessToken] = process.argv;
const api = axios.create({
  baseURL: 'https://api.github.com',
});

if (accessToken) {
  api.defaults.headers.authorization = `Bearer ${accessToken}`;
}

function calcIssuesClosedInLast30Days(repos) {
  const recentIssues = repos.reduce(
    (sum, { total }) => {
      if (total > 0) {
        return {
          total: sum.total + total,
          repositories: sum.repositories + 1,
        };
      }
      return sum;
    },
    {
      total: 0,
      repositories: 0,
    }
  );
  return {
    key: 'recentIssues',
    title: 'Issues closed\nin last 30 days',
    value: recentIssues.total,
    description: `in ${recentIssues.repositories} repo(s)`,
  };
}

function calcLastWeekCommits(repos) {
  const recentCommits = repos.reduce(
    (sum, { participation: { owner } }) => {
      const commitsCount = owner.pop();
      if (commitsCount > 0) {
        return {
          total: sum.total + commitsCount,
          repositories: sum.repositories + 1,
        };
      }
      return sum;
    },
    {
      total: 0,
      repositories: 0,
    }
  );

  return {
    key: 'recentsCommit',
    title: 'Commits in\nlast 7 days',
    value: recentCommits.total,
    description: `in ${recentCommits.repositories} repo(s)`,
  };
}

function calcCommitsAverange(repos) {
  const commitsTotal = repos.reduce((sum, { commits }) => {
    return sum + commits;
  }, 0);

  const average = Math.floor(commitsTotal / repos.length);

  return {
    key: 'commitsAverage',
    title: 'Commits\nAverange',
    value: average || 0,
    description: `in ${repos.length} repo(s)`,
  };
}

function compareByUsage(a, b) {
  if (a && b.usage < a.usage) {
    return a;
  }
  return b;
}

function calculateUsage(language, usageTotal) {
  const usagePercent = Number(
    ((language.usage / usageTotal) * 100).toPrecision(2)
  );

  return {
    ...language,
    usage: usagePercent,
    percent: usagePercent,
  };
}

function calcLanguagesUsage(results) {
  const languages = {};
  let usageTotal = 0;

  results.forEach(({ languages: repoUsage }) => {
    Object.keys(repoUsage).forEach(languageName => {
      const usage = repoUsage[languageName];
      const language = languages[languageName];

      usageTotal += usage;

      if (language) {
        language.usage += usage;
      } else {
        const { color, aliases, ace_mode } = colors.get(languageName);

        let languageColorName = ace_mode;
        if (ace_mode.length > 6 && aliases) {
          languageColorName = aliases
            .sort((a, b) => a.length - b.length)
            .shift();
        }

        languages[languageName] = {
          name: languageColorName,
          usage,
          color,
        };
      }
    });
  });

  let rest = 100;
  const percents = Object.keys(languages).map(key => {
    const usage = calculateUsage(languages[key], usageTotal);
    rest -= usage.percent;
    return usage;
  });

  const languageMostUsed = percents.reduce(compareByUsage, null);
  rest = Number(rest.toPrecision(2));

  languageMostUsed.usage += rest;
  languageMostUsed.percent += rest;

  return percents;
}

function countRepoStat(login, repoName) {
  return async (path, params = { per_page: 100 }) =>
    api
      .get(`/repos/${login}/${repoName}/${path}`, params)
      .then(({ data, headers }) => {
        if (headers.link) {
          const link = headers.link
            .split(',')
            .find(part => part.search(/rel="last"/i) > -1);

          if (link) {
            const page = link
              .match(/&page=\d+/i)
              .pop()
              .replace(/&page=/i, '');

            params.params.page = page;
            return api
              .get(`/repos/${login}/${repoName}/${path}`, params)
              .then(response => {
                return (
                  params.params.per_page * (page - 1) + response.data.length
                );
              });
          }
        }

        return data.length;
      });
}

function getRepoStat(login, repoName) {
  return async path => api.get(`/repos/${login}/${repoName}/${path}`);
}

async function getReposStats({ login, repos }) {
  const promises = repos.map(async repoName => {
    const result = {};
    const perPage = 100;

    const date = new Date();
    date.setDate(date.getDate() - 30);

    const getStat = getRepoStat(login, repoName);
    const countStat = countRepoStat(login, repoName);

    return Promise.all([
      getStat('languages').then(response => {
        result.languages = response.data;
      }),
      getStat('stats/participation').then(response => {
        result.participation = response.data;
      }),
      countStat('commits', {
        params: {
          per_page: perPage,
        },
      }).then(count => {
        result.commits = count;
      }),
      countStat('issues', {
        params: {
          per_page: perPage,
          state: 'closed',
          since: date.toISOString(),
        },
      }).then(count => {
        result.issues = count;
      }),
    ]).then(() => result);
  });

  return Promise.all(promises);
}

async function handleReposResponse({ data, headers }, login) {
  const repos = data.map(({ name }) => name);

  if (headers.link) {
    const next = headers.link
      .split(',')
      .find(url => url.search(/rel="next"/g) > -1);

    if (next) {
      const url = next.split(';').shift().replace(/<|>/g, '');

      return api
        .get(url)
        .then(response => {
          return handleReposResponse(response, login);
        })
        .then(response => {
          return {
            repos: [...response.repos, ...repos],
            login,
          };
        });
    }
  }

  return {
    repos,
    login,
  };
}

async function getRepos(login) {
  return api
    .get(`/users/${login}/repos`)
    .then(response => handleReposResponse(response, login));
}

async function getUser(login) {
  return api
    .get(`/users/${login}`)
    .then(({ data: { name, avatar_url, html_url } }) => {
      return {
        name,
        avatar_url,
        login,
        url: html_url,
      };
    });
}

async function getProfileDate(login) {
  const result = { stats: [] };
  const repos = await getUser(login)
    .then(user => {
      result.user = user;
      return user.login;
    })
    .then(getRepos)
    .then(getReposStats)
    .catch(err => {
      throw err;
    });

  console.log(JSON.stringify(repos));
  result.languages = calcLanguagesUsage(repos);
  [
    calcCommitsAverange,
    calcLastWeekCommits,
    calcIssuesClosedInLast30Days,
  ].forEach(func => {
    result.stats.push(func(repos));
  });

  return fs.promises.writeFile(
    `${process.cwd()}/scripts/stats.json`,
    JSON.stringify(result, null, 2)
  );
}

if (!userName) {
  const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  reader.question("Type the profile's username: \n", input => {
    getProfileDate(input).then(process.exit);
  });
} else {
  getProfileDate(userName);
}
