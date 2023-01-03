import styled from 'styled-components';

export const Container = styled.div`
  padding: 16px;
  background: #30454C;
  border-radius: 8px;
  border: 1px solid #506167;
  margin-top: 8px;
  position: relative;
  width: 100%;

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

  .chart-container {
    width: 100%;
    height: 400px;
    position: relative
  }
`;
