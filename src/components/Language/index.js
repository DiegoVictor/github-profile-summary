import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';

export default function Percent({ color, percent, label }) {
  return (
    <Container color={color} percent={percent}>
      {label}
      <span>{percent}%</span>
    </Container>
  );
}

Percent.propTypes = {
  color: PropTypes.string.isRequired,
  percent: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Percent.defaultProps = {
  label: '',
};
