import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.bg};
  color: ${props => props.color};
  font-size: 12px;
  font-weight: 900;
  height: calc(100%);
  min-width: 1%;
  overflow: hidden;
  padding: 5px;
  position: relative;
  text-transform: uppercase;
  transition: all 0.5s;
  width: ${props => props.size}%;

  &:hover {
    box-shadow: 0px 0px 5px ${props => props.bg};
    min-width: 90%;

    ~ div {
      min-width: 5%;
    }
  }

  span {
    font-size: 15px;
    opacity: 0.3;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
