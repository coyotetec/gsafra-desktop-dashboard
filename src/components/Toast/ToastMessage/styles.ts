import styled, { css, keyframes } from 'styled-components';
import { toastType } from '../../../utils/toast';

const messageIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const containerVariants = {
  default: css`
    background: #506167;
  `,
  success: css`
    background: #00D47E;
  `,
  danger: css`
    background: #FF5555;
  `,
};

interface ContainerProps {
  type?: toastType;
}

export const Container = styled.div<ContainerProps>`
  padding: 12px 16px;
  border-radius: 4px;
  color: #F7FBFE;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  animation: ${messageIn} 0.3s;

  ${({ type }) => type ? containerVariants[type] : containerVariants.default}

  & + & {
    margin-top: 8px;
  }

  strong {
    font-weight: 600;
    font-size: 14px;
    max-width: 280px;
  }

  svg {
    margin-right: 4px;
  }
`;
