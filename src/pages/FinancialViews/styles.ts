import styled from 'styled-components';

export const Container = styled.main`
  header {
    h1 {
      font-size: 24px;
      color: #f7fbfe;
      font-weight: 600;
    }

    span {
      font-size: 14px;
      color: #cfd4d6;
      letter-spacing: 0.02em;
      margin-top: 4px;
      display: block;
    }
  }

  .views-grid {
    margin-top: 32px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;
