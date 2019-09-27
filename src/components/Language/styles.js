import styled from 'styled-components';
import hexRgb from 'hex-rgb';

export const Container = styled.div`
  background-color: ${props => props.color};
  box-sizing: border-box;
  box-shadow: 0px 0px 5px ${props => props.color};
  color: ${props => {
    const { red, green, blue } = hexRgb(props.color);
    if ((red * 299 + green * 587 + blue * 114) / 1000 > 186) {
      return '#000000';
    }
    return '#FFFFFF';
  }};
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  height: 100%;
  min-width: 5%;
  overflow: hidden;
  padding: 5px;
  position: relative;
  text-transform: uppercase;
  transition: all 0.5s;
  width: ${props => props.percent}%;

  &:hover {
    min-width: 70%;

    ~ div {
      min-width: 5%;
    }
  }

  @media (max-width: 600px) {
    &.expand {
      min-width: 70%;

      ~ div {
        min-width: 5%;
      }
    }
  }

  span {
    box-sizing: border-box;
    font-size: 15px;
    opacity: 0.3;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
