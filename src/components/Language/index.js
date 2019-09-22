import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';

export default function Percent({ bg, color, size, label }) {
  return (
    <Container bg={bg} color={color} size={size}>
      {label}
      <span>{size}%</span>
    </Container>
  );
}

Percent.propTypes = {
  bg: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  label: PropTypes.string,
};

Percent.defaultProps = {
  label: '',
};
