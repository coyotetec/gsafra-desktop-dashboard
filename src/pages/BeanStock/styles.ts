import styled from 'styled-components';

export const Container = styled.main`
  .filters {
    margin-top: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;

    .date-filter {
      display: grid;
      grid-template-columns: 1fr 24px 1fr;
      place-items: center;

      strong {
        font-size: 16px;
        font-weight: 500;
        margin-top: 16px;
      }
    }

    button {
      height: 48px;
      background: #506167;
      border: none;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
      margin-top: auto;
    }
  }
`;
