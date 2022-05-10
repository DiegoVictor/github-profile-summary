import styled from 'styled-components';
import hexRgb from 'hex-rgb';

export const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  font-family: Roboto, Arial, sans-serif;
  justify-content: center;
  height: 100%;
  padding: 0px 10px;
  width: 100%;
`;

export const Box = styled.div`
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 0px 0px 5px #aaa;
  display: flex;
  max-width: 590px;
  padding: 10px;
  overflow: hidden;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    width: auto;
  }

  img {
    box-sizing: border-box;
    border-radius: 4px;
    display: block;
    height: auto;
    transition: all 0.25s;
    width: 220px;

    @media (max-width: 600px) {
      margin-bottom: 10px;
      max-width: 300px;
      min-width: 251px;
      width: 100%;
    }
  }
`;

export const Resume = styled.div`
  box-sizing: border-box;
  margin-left: 10px;
  width: calc(100% - 230px);

  @media (max-width: 600px) {
    margin: auto;
    width: 100%;
  }
`;

export const Usage = styled.div`
  box-sizing: border-box;
  height: 60px;
  display: flex;
  margin-bottom: 10px;
  overflow: hidden;

  > div:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  > div:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const Language = styled.div`
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
  width: ${props => props.usage}%;

  &:hover {
    min-width: 55%;

    ~ div {
      min-width: 5%;
    }
  }

  @media (max-width: 600px) {
    & {
      min-width: ${props => (props.selected ? '55%' : '5%')};
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

export const Stats = styled.div`
  align-items: center;
  box-sizing: border-box;
  border-top: 1px solid #ddd;
  display: flex;
  height: 111px;
`;

export const Stat = styled.div`
  box-sizing: border-box;
  cursor: unset;
  display: block;
  font-size: 10px;
  font-weight: normal;
  line-height: 13px;
  justify-content: center;
  opacity: 0.7;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.5s;
  width: calc(100% / 3);

  &:hover {
    transform: scale(1.05);
  }

  span {
    display: block;
    font-size: 30px;
    font-weight: 900;
    line-height: 35px;
    width: 100%;
  }
`;

export const Link = styled.a`
  background-color: #61ba59;
  border-radius: 4px;
  box-sizing: border-box;
  color: white;
  display: block;
  font-weight: 900;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.5s;
  width: 100%;

  &:hover {
    box-shadow: 0px 0px 5px #61ba59;
    letter-spacing: 0.25px;
  }
`;
