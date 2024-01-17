import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

interface OverlayProps {
  isLeaving: boolean;
}

export const Overlay = styled.div<OverlayProps>`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(16, 40, 48, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: ${fadeIn} 0.3s;

  ${({ isLeaving }) =>
    isLeaving &&
    css`
      animation: ${fadeOut} 0.3s forwards;
    `}

  .spinner {
    animation: ${rotate} 2s linear infinite;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
  }

  .spinner .path {
    stroke: #00d47e;
    stroke-linecap: round;
    animation: ${dash} 1.5s ease-in-out infinite;
  }
`;
