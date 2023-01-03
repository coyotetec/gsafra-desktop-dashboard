import styled from 'styled-components';

export const Container = styled.div`
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    > div {
      display: flex;
      align-items: center;
      gap: 8px;

      strong {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .card {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background: #30454C;
    border-radius: 8px;
    border: 1px solid #506167;
    margin-top: 8px;
    position: relative;

    > footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;

      button {
        background: transparent;
        border: none;
        display: flex;
      }

      a {
        color: #00D47E;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
`;
