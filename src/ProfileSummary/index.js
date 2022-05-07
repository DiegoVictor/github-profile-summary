import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Box,
  Resume,
  Usage,
  Language,
  Stats,
  Stat,
  Link,
} from './styles';

function ProfileSummary({ data }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const language = ({
    name,
    percent,
    color,
    usage,
    selected = name === selectedLanguage,
  }) => (
    <Language
      key={name}
      usage={percent}
      color={color}
      selected={selected}
      data-testid={`language-${name}`}
      data-selected={selected}
      onClick={() => setSelectedLanguage(selected ? '' : name)}
    >
      {name}
      <span>{usage}</span>
    </Language>
  );

  if (
    data &&
    Object.keys(data).length > 0 &&
    data.user &&
    data.stats &&
    data.languages
  ) {
    return (
      <Container data-testid="profile-summary">
        <Box>
          <img src={data.user.avatar_url} alt={data.user.name} />
          <Resume>
            <Usage>{data.languages.map(language)}</Usage>

            <Stats>
              {data.stats.map(stat => (
                <Stat key={stat.key} data-testid={`stat-${stat.key}`}>
                  {stat.title
                    .replace(/<br ?\/>/gi, ' \n ')
                    .split('\n')
                    .map(string => (
                      <Fragment key={string}>
                        {string}
                        <br />
                      </Fragment>
                    ))}
                  <span>{stat.value}</span>
                  {stat.description}
                </Stat>
              ))}
            </Stats>

            <Link
              id="see-profile"
              href={data.user.url}
              rel="noopener noreferrer"
              target="_blank"
              data-testid="login"
            >
              {data.user.login}
            </Link>
          </Resume>
        </Box>
      </Container>
    );
  }

  return null;
}

ProfileSummary.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar_url: PropTypes.string.isRequired,
        login: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
      languages: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          usage: PropTypes.string.isRequired,
          percent: PropTypes.number.isRequired,
          color: PropTypes.string.isRequired,
        })
      ),
      stats: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          description: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
    PropTypes.bool,
  ]).isRequired,
};

export default ProfileSummary;
