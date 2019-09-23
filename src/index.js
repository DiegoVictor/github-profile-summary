import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import GithubSummary from './components/GithubSummary';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

(async username => {
  const { data: user } = await api.get(`/users/${username}`);
  const { data: repos } = await api.get(`/users/${username}/repos`);

  const languages = {};
  for (const { name } of repos) {
    const { data: langs } = await api.get(
      `/repos/${username}/${name}/languages`
    );

    Object.keys(langs).forEach(lang => {
      if (typeof langs[lang] === 'number') {
        let value = langs[lang];

        if (typeof languages[lang] === 'number') {
          value += languages[lang];
        }

        languages[lang] = value;
      }
    });
  }

  const total = Object.values(languages).reduce((sum, value) => sum + value, 0);

  Object.keys(languages).forEach(key => {
    const percent = (languages[key] / total) * 100;
    languages[key] = percent.toPrecision(2);
  });

  const { data: stats } = await api.get('stats');

  ReactDOM.render(
    <GithubSummary user={user} languages={languages} stats={stats} />,
    document.getElementById('root')
  );
})('DiegoVictor');
