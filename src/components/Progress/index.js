import React from 'react';
import { Container } from './styles';

export default function Percent({ bg, color, size, label }) {
  return (
    <Container bg={bg} color={color} size={size}>
      {label}
      <span>{size}%</span>
    </Container>
  );
}
