import styled from 'styled-components';

export const Container = styled.main`
  header {
    h1 {
      font-size: 24px;
      color: #F7FBFE;
      font-weight: 600;
    }

    span {
      font-size: 14px;
      color: #CFD4D6;
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
