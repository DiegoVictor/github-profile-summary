const axios = require('axios');
const colors = require('github-colors');
const fs = require('fs');

const [, , userName, accessToken = null] = process.argv;
const api = axios.create({
  baseURL: 'https://api.github.com',
});

const PER_PAGE = 100;

if (accessToken) {
  api.defaults.headers.authorization = `Bearer ${accessToken}`;
}

/**
 * @typedef {{
 *  name: string,
 *  avatar_url: string,
 *  login: string,
 *  url: string
 * }} User
 *
 * @param {string} login
 * @returns {User}
 */
const getUser = login =>
  api
    .get(`/users/${login}`)
    .then(({ data: { name, avatar_url, html_url } }) => ({
      name,
      avatar_url,
      login,
      url: html_url,
    }));

/**
 *
 * @param {string} login
 * @param {number} page
 * @returns {string[]}
 */
const getReposList = (login, page = 1) =>
  api
    .get(`/users/${login}/repos`, {
      params: {
        page,
        per_page: PER_PAGE,
      },
    })
    .then(({ data, headers }) => {
      const repos = data.map(({ name }) => name);
      if (data.length === PER_PAGE && headers.link) {
        return getReposList(login, page + 1).then(result =>
          repos.concat(result)
        );
      }
      return repos;
    })
    .then(data => data);

/**
 *
 * @param {string} path
 * @param {string} repoName
 * @returns {(key: string) => Promise<any>}
 */
const getOneStat = (login, repoName) => async key =>
  api.get(`/repos/${login}/${repoName}/${key}`).then(({ data }) => data);

/**
 *
 * @param {{
 *  login: string,
 *  repoName: string,
 *  key: string,
 *  page: number
 * }}
 * @returns {Promise<{
 *  data: any[],
 *  headers: Record<string, string>
 * }>}
 */
const getCommitsPage = async ({ login, repoName, key, page = 1 }) =>
  api.get(`/repos/${login}/${repoName}/${key}`, {
    params: {
      per_page: PER_PAGE,
      page,
    },
  });

/**
 *
 * @param {string} login
 * @param {string} repoName
 * @returns {(
 *    key: string,
 *    options: Record<string, string>
 *  ) => Promise<number>
 * }
 */
const count =
  (login, repoName) =>
  async (key, options = {}) => {
    const params = { login, repoName, key, ...options };
    const { data, headers } = await getCommitsPage(params);

    if (data.length === PER_PAGE && headers.link) {
      const lastPage = headers.link
        .match(/&page=\d+/gi)
        .map(page => Number(page.split('=').pop()))
        .pop();

      params.page = lastPage;

      return getCommitsPage(params).then(
        response => response.data.length + PER_PAGE * (lastPage - 1)
      );
    }

    return data.length;
  };

/**
 * @typedef {{
 *  languages: Record<string, number>,
 *  participation: { [key: string]: Record<string, number> },
 *  commits: number,
 *  issues: number
 * }} Repo
 *
 * @param {string} repoName
 * @param {string} login
 * @returns {Promise<Repo[]>}
 */
const getRepoStats = async (repoName, login) => {
  const getter = getOneStat(login, repoName);
  const counter = count(login, repoName);

  const promises = [];
  ['languages', 'stats/participation'].forEach(key => {
    promises.push(getter(key));
  });

  promises.push(counter('commits'));

  const date = new Date();
  date.setDate(date.getDate() - 30);
  promises.push(
    counter('issues', {
      state: 'closed',
      since: date.toISOString(),
    })
  );

  return Promise.all(promises).then(
    ([languages, participation, commits, issues]) => ({
      languages,
      participation,
      commits,
      issues,
    })
  );
};

/**
 *
 * @param {string} language
 * @returns {{
 *  name: string,
 *  color: string,
 * }}
 */
const getNameAndColor = language => {
  const { color, aliases, ace_mode: aceMode } = colors.get(language);

  let name = aceMode;
  if (aceMode.length > 6 && Array.isArray(aliases) && aliases.length > 0) {
    const [alias] = aliases.sort((a, b) => a.length - b.length);
    if (alias.length < aceMode.length) {
      name = alias;
    }
  }

  return {
    name,
    color,
  };
};

/**
 * @typedef {{
 *  name: string,
 *  color: string,
 *  usage: string,
 *  percent: number
 * }} Language
 *
 * @param {Repo[]} repos
 * @returns {Language[]}
 */
const calcUsage = repos => {
  let highUsage = '';
  const result = repos.reduce(
    (usage, { languages }) => {
      const names = Object.keys(languages);

      names.forEach(languageName => {
        const languageUsage = languages[languageName];
        const { name, color } = getNameAndColor(languageName);

        usage.total += languageUsage;

        if (!usage[name]) {
          usage[name] = {
            name,
            color,
            usage: languageUsage,
          };
        } else {
          usage[name].usage += languageUsage;
        }

        if (
          highUsage.length === 0 ||
          (highUsage !== name && usage[name].usage > usage[highUsage].usage)
        ) {
          highUsage = name;
        }
      });

      return usage;
    },
    { total: 0 }
  );

  const { total, ...languages } = result;
  const names = Object.keys(languages);

  let sum = 0;
  names.forEach(language => {
    const { name, color, usage } = languages[language];
    const percent = Number(((usage / total) * 100).toPrecision(2));

    sum += percent;
    languages[language] = {
      name,
      color,
      percent,
      usage: `${percent}%`,
    };
  });

  languages[highUsage].percent += 100 - sum;
  languages[highUsage].usage = `${languages[highUsage].percent}%`;

  return Object.values(languages);
};

/**
 * @typedef {{
 *  key: string,
 *  title: string,
 *  value: number,
 *  description: string,
 * }} Stat
 *
 * @param {Repo[]} repos
 * @return {Stat}
 */
const getCommitsAverage = repos => {
  const total = repos.reduce((sum, { commits }) => {
    return sum + commits;
  }, 0);

  const average = Math.floor(total / repos.length);

  return {
    key: 'commits_average',
    title: 'Commits\nAverage',
    value: average || 0,
    description: `in ${repos.length} repo(s)`,
  };
};

/**
 *
 * @param {Repo[]} repos
 * @returns {Stat}
 */
const getLastWeekCommits = repos => {
  const commits = repos.reduce(
    ({ total, repositories }, { participation: { owner } }) => {
      const amount = owner.pop();
      if (amount > 0) {
        return {
          total: total + amount,
          repositories: repositories + 1,
        };
      }
      return { total, repositories };
    },
    {
      total: 0,
      repositories: 0,
    }
  );

  return {
    key: 'recent_commits',
    title: 'Commits in\nlast 7 days',
    value: commits.total,
    description: `in ${commits.repositories} repo(s)`,
  };
};

/**
 *
 * @param {Repo[]} repos
 * @returns {Stat}
 */
const getIssuesClosedInLast30Days = repos => {
  const issues = repos.reduce(
    ({ total, repositories }, { total: amount }) => {
      if (amount > 0) {
        return {
          total: total + amount,
          repositories: repositories + 1,
        };
      }
      return { total, repositories };
    },
    {
      total: 0,
      repositories: 0,
    }
  );

  return {
    key: 'recent_issues',
    title: 'Issues closed\nin last 30 days',
    value: issues.total,
    description: `in ${issues.repositories} repo(s)`,
  };
};

/**
 *
 * @param {Repo[]} repos
 * @returns {Stat[]}
 */
const calcStats = repos =>
  [getCommitsAverage, getLastWeekCommits, getIssuesClosedInLast30Days].reduce(
    (stats, cb) => {
      stats.push(cb(repos));
      return stats;
    },
    []
  );

/**
 *
 * @param {{
 *  user: User,
 *  languages: Language[],
 *  stats: Stat[]
 * }} result
 * @returns {Promise<void>}
 */
const save = async result =>
  fs.promises.writeFile(
    `${process.cwd()}/scripts/stats.json`,
    JSON.stringify(result, null, 2)
  );

getUser(userName)
  .then(user =>
    getReposList(user.login)
      .then(repos =>
        Promise.all(repos.map(repo => getRepoStats(repo, user.login)))
      )
      .then(stats => ({
        user,
        languages: calcUsage(stats),
        stats: calcStats(stats),
      }))
  )
  .then(save);
