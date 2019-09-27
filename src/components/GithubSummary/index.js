import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import colors from 'github-colors';
import Language from '../Language';
import { Container, User, Bio, Stats, Summary } from './styles';

function GithubProfile({ user, usage, stats }) {
  const [selected, setSelected] = useState('');
  const [opacity, setOpacity] = useState(1);

  return (
    <Container>
      <User>
        <div>
          <Bio
            onClick={() => setOpacity(opacity > 0 ? 0 : 1)}
            opacity={opacity}
          >
            <img src={user.avatar_url} alt={user.name} />
            <p>{user.bio}</p>
          </Bio>
          <Summary>
            <div>
              {Object.keys(usage).map(key => {
                const { color, aliases, ace_mode: name } = colors.get(key);

                return (
                  <Language
                    color={color}
                    label={
                      name.length > 6
                        ? aliases.sort((a, b) => a.length - b.length)[0]
                        : name
                    }
                    key={key}
                    percent={usage[key]}
                    selected={selected === key}
                    onClick={() => setSelected(key === selected ? '' : key)}
                  />
                );
              })}
            </div>
            <div>
              {stats.map(stat => (
                <Stats key={stat.key}>
                  <div>
                    <span>
                      {stat.description.split('\n').map(txt => (
                        <Fragment key={txt}>
                          {txt}
                          <br />
                        </Fragment>
                      ))}
                    </span>
                    {stat.value < 10 ? `0${stat.value}` : stat.value}
                    <span>
                      in {stat.repos} {stat.repos > 1 ? 'repos' : 'repo'}
                    </span>
                  </div>
                </Stats>
              ))}
            </div>
            <a
              href={`https://github.com/${user.login}`}
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
  usage: PropTypes.object.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      repos: PropTypes.number.isRequired,
    })
  ).isRequired,
};
