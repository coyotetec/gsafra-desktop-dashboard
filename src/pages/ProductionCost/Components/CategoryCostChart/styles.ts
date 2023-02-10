import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 400px;
  position: relative;

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 360px;

    img {
      width: 160px;
    }

    strong {
      margin-top: 12px;
    }

    span {
      font-size: 14px;
    }
  }
`;
