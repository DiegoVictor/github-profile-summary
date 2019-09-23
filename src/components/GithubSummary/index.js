import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import colors from 'github-colors';
import Language from '../Language';
import { Container, User, Bio, Stats, Summary } from './styles';

function GithubProfile({ user, languages, stats }) {
  return (
    <Container>
      <User>
        <div>
          <Bio>
            <img src={user.avatar_url} alt={user.name} />
            <p>{user.bio}</p>
          </Bio>
          <Summary>
            <div>
              {Object.keys(languages).map(key => {
                const { color, aliases, ace_mode: name } = colors.get(key);

                return (
                  <Language
                    color={color}
                    label={
                      name.length > 6
                        ? aliases.sort((a, b) => a - b).shift()
                        : name
                    }
                    key={key}
                    percent={languages[key]}
                  />
                );
              })}
            </div>
            <div>
              {stats.map(stat => (
                <Stats key={stat.label}>
                  <div>
                    <span>
                      {stat.label.split('\n').map(txt => (
                        <Fragment key={txt}>
                          {txt}
                          <br />
                        </Fragment>
                      ))}
                    </span>
                    {stat.value}
                    <span>{stat.comment}</span>
                  </div>
                </Stats>
              ))}
            </div>
            <a
              href={`https://github.com/${user.name}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              View Profile
            </a>
          </Summary>
        </div>
      </User>
    </Container>
  );
}

export default GithubProfile;

GithubProfile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  }).isRequired,
  languages: PropTypes.object.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      comment: PropTypes.string.isRequired,
    })
  ).isRequired,
};
