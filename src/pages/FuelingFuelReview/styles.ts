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
  }

  > a {
    margin-bottom: 32px;
    display: block;
    margin-top: 8px;
    color: #00d47e;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    text-align: right;
  }

  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
`;
