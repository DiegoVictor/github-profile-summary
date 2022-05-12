# Github Profile Summary
[![Travis](https://img.shields.io/travis/com/diegovictor/github-profile-summary?logo=travis&style=flat-square)](https://app.travis-ci.com/DiegoVictor/github-profile-summary)
[![npm](https://img.shields.io/npm/v/@diegovictor/github-profile-summary?style=flat-square)](https://www.npmjs.com/package/@diegovictor/github-profile-summary)
[![react](https://img.shields.io/badge/reactjs-18.1.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-5.3.5-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![babel](https://img.shields.io/badge/babel-7.17.10-F9DC3E?style=flat-square&logo=babel)](https://babeljs.io/)
[![eslint](https://img.shields.io/badge/eslint-8.15.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![prettier](https://img.shields.io/badge/prettier-2.6.2-F7B93E?style=flat-square&logo=prettier)](https://prettier.io/)
[![jest](https://img.shields.io/badge/jest-28.1.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/github-profile-summary?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/github-profile-summary)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/github-profile-summary/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>

![DiegoVictor](https://raw.githubusercontent.com/DiegoVictor/github-profile-summary/master/screenshots/demo.gif)

Use this component to show a summary of your github stats with a cool design 😎

# Installing
Just run:
```
npm install @diegovictor/github-profile-summary
```
Or simply:
```
yarn add @diegovictor/github-profile-summary
```

# Usage
So easy than make a lemonade:
```js
import React from 'react';
import ReactDOM from "react-dom/client";
import { ProfileSummary } from '@diegovictor/github-profile-summary';
import data from "./data.json";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ProfileSummary data={data} />,);
```

## Structure
The `data` attribute must receive an object with the following structure:
```js
{
  user: {
    name: 'Diego Victor',
    avatar_url: 'https://avatars3.githubusercontent.com/u/15165349?v=4',
    login: 'DiegoVictor',
    url: 'https://github.com/DiegoVictor',
  },
  languages: [
    {
      name: 'JS',
      usage: '67%',
      percent: 67,
      color: '#f1e05a',
    },
    ...
  ],
  stats: [
    {
      key: 1,
      title: 'Commit\nAverage',
      value: 59,
      description: 'in 18 repos',
    },
    ...
  ],
}
```
> The `stats` array must have only 3 items, any item after the third position will be ignored

Field|Format|Description
---|---|---
`user`|object| -
`user.name`|string|Utilized as fallback to image in case of it not loads.
`user.avatar_url`|string|Avatar's URL.
`user.login`|string|Green button label.
`user.url`|string|Link to open when the green button is clicked.
`languages`|array| -
`languages[].name`|string|Language name or alias.
`languages[].usage`|string|Language label.
`languages[].percent`|number|Language percent usage. Defines language area occupied.
`languages[].color`|string|Language color (hexadecimal color code).
`stats`|array| -
`stats[].key`|string,number|Unique identifier.
`stats[].title`|string|Text at the top of stats.
`stats[].value`|number|The stat number.
`stats[].description`|string|Text at the bottom of the stat.

## Data
With in this package there is a script to calcule stats and language usage from a provided github's user, just run `scripts/main.js` passing the user github's username as parameter:
```shell
$ node scripts/main.js diegovictor
```
> Github has a low limit of requests non authenticated, if the provided user have a lot of repositories probably the limit will be reached easyly, to avoid this problem [create a personal access token](https://docs.github.com/pt/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) to have a greater limit, then pass it as a second parameter to the script:
```shell
$ node scripts/main.js diegovictor ghp_p07LDQ1xUyRJ4dExb6U1YfVlEW1vgX2SKiFQ
```
A `stats.json` file will be create aside the script, just copy its content and pass it to component into `data` attribute.
