import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;

  .back-button {
    background: transparent;
    border: none;
    display: flex;
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: translateX(-4px);
    }
  }

  .refresh-button {
    margin-left: auto;
    height: 48px;
    width: 48px;
    background: #506167;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 24px;
    color: #F7FBFE;
    font-weight: 600;
  }

  h2 {
    font-size: 14px;
    color: #CFD4D6;
    letter-spacing: 0.02em;
    font-weight: 600;
  }
`;
