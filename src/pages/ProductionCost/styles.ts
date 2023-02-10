import styled, { css, keyframes } from 'styled-components';

const messageIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const messageOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

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
`;

interface HectareCostMessageProps {
  isLeaving: boolean;
}

export const HectareCostMessage = styled.div<HectareCostMessageProps>`
  margin-left: auto;
  background: #30454C;
  border-radius: 8px;
  border: 1px solid #506167;
  font-size: 12px;
  display: flex;
  overflow: hidden;
  margin-top: 12px;
  animation: ${messageIn} 0.3s ease-in-out;

  ${({ isLeaving }) => isLeaving && css`
    animation: ${messageOut} 0.2s forwards;
  `}

  div {
    background: #506167;
    padding: 8px 12px;
    display: flex;
    align-items: center;
  }

  span {
    display: flex;
    align-items: center;
    padding: 0 8px;
  }
`;
