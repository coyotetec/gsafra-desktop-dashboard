import styled from 'styled-components';

export const Container = styled.div`
  padding: 16px;
  background: #30454c;
  border-radius: 8px;
  border: 1px solid #506167;
  margin-top: 8px;
  position: relative;
  width: 100%;
  overflow: hidden;

  > header {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    strong {
      font-size: 14px;
      font-weight: 500;
    }

    span {
      font-weight: 600;
      font-size: 16px;
    }

    button {
      background: transparent;
      border: none;
      display: flex;
    }
  }

  .empty {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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

  .chart-container {
    width: 100%;
    height: 400px;
    position: relative;
  }
`;

export const Loader = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(48, 69, 76, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
