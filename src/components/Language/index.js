import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';

export default function Percent({ color, percent, label, selected, onClick }) {
  return (
    <Container
      className={selected ? 'expand' : ''}
      color={color}
      percent={percent}
      onClick={onClick}
    >
      {label}
      <span>{percent}%</span>
    </Container>
  );
}

Percent.propTypes = {
  color: PropTypes.string.isRequired,
  percent: PropTypes.string.isRequired,
  label: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

Percent.defaultProps = {
  label: '',
  selected: false,
  onClick: () => {},
};
