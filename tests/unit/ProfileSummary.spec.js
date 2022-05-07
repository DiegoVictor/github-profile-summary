import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import ProfileSummary from '../../src/ProfileSummary';

const data = {
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
    {
      name: 'CSS',
      usage: '33%',
      percent: 33,
      color: '#a1e200',
    },
  ],
  stats: [
    {
      key: 1,
      title: 'Commit\nAverage',
      value: 59,
      description: 'in 18 repos',
    },
  ],
};

describe('ProfileSummary', () => {
  it('should not render if no data is provided', async () => {
    const error = jest.spyOn(console, 'error');
    error.mockImplementationOnce(() => {});

    const { queryByTestId } = render(<ProfileSummary data={null} />);

    expect(queryByTestId('profile-summary')).not.toBeInTheDocument();
    expect(error).toHaveBeenCalled();
  });

  it('should not render if no user or stats or languages is provided', async () => {
    const error = jest.spyOn(console, 'error');
    error.mockImplementationOnce(() => {});

    const { queryByTestId } = render(<ProfileSummary data={{}} />);

    expect(queryByTestId('profile-summary')).not.toBeInTheDocument();
    expect(error).toHaveBeenCalled();
  });

  it('should render the component', async () => {
    const { getByTestId, getByAltText, getByText } = render(
      <ProfileSummary data={data} />
    );

    expect(getByTestId('profile-summary')).toBeInTheDocument();

    expect(getByAltText(data.user.name)).toHaveAttribute(
      'src',
      data.user.avatar_url
    );
    expect(getByText(data.user.login)).toBeInTheDocument();
    expect(getByTestId('login')).toHaveAttribute('href', data.user.url);

    data.stats.forEach(stat => {
      expect(getByTestId(`stat-${stat.key}`)).toHaveTextContent(
        `${stat.title.split('\n').join('')}${stat.value}${stat.description}`
      );
    });

    data.languages.forEach(language => {
      const container = getByTestId(`language-${language.name}`);

      expect(container).toHaveTextContent(`${language.name}${language.usage}`);
      expect(container).toHaveStyle({
        'background-color': language.color,
        width: `${language.percent}%`,
      });
    });
  });

  it('should be able to select a language', async () => {
    const { getByTestId } = render(<ProfileSummary data={data} />);

    expect(getByTestId('profile-summary')).toBeInTheDocument();

    const [language] = data.languages.slice(-1);

    const element = getByTestId(`language-${language.name}`);
    expect(element).toHaveAttribute('data-selected', 'false');

    await act(async () => {
      fireEvent.click(element);
    });

    expect(element).toHaveAttribute('data-selected', 'true');

    await act(async () => {
      fireEvent.click(element);
    });

    expect(element).toHaveAttribute('data-selected', 'false');
  });
});
