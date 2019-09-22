import styled, { createGlobalStyle } from 'styled-components';

export const Style = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap');

  * {
    box-sizing: border-box;
    margin: 0px;
    outline: 0px;
    padding: 0px;
  }

  body {
    background-color: #F7F5F5;
    color: #352e2f;
    font-family: Roboto, sans-serif;
  }
`;

export const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

export const User = styled.div`
  border-radius: 4px;
  box-shadow: 0px 0px 5px #aaa;
  max-width: 590px;
  overflow: hidden;
  width: 100%;

  > div {
    display: flex;
    padding: 10px;

    img {
      border-radius: 4px;
      display: block;
      height: auto;
      width: 220px;
    }
  }
`;

export const Summary = styled.div`
  margin-left: 10px;
  width: calc(100% - 230px);

  > a {
    background-color: #61ba59;
    border-radius: 4px;
    color: white;
    display: block;
    font-weight: 900;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    transition: all 0.5s;

    &:hover {
      box-shadow: 0px 0px 5px #61ba59;
    }
  }

  > div {
    display: flex;

    &:first-child {
      height: 60px;
      margin-bottom: 10px;
      overflow: hidden;

      > div:first-child {
        border-radius: 4px 0px 0px 4px;
      }

      > div:last-child {
        border-radius: 0px 4px 4px 0px;
      }
    }

    + div {
      align-items: stretch;
      border-top: 1px solid #ddd;
      height: 111px;
    }
  }
`;

export const Stats = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 30px;
  font-weight: 900;
  justify-content: center;
  line-height: 35px;
  text-align: center;
  transition: all 0.5s;
  width: calc(100% / 3);

  &:hover {
    transform: scale(1.1);
  }

  span {
    opacity: 0.7;
    display: block;
    font-size: 10px;
    font-weight: normal;
    line-height: 13px;
    text-transform: uppercase;
  }
`;
