import styled, { keyframes } from 'styled-components';

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

interface SvgProps {
  size: number;
}

export const Svg = styled.svg<SvgProps>`
  animation: ${rotate} 2s linear infinite;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;

  .path {
    stroke: #00D47E;
    stroke-linecap: round;
    animation: ${dash} 1.5s ease-in-out infinite;
  }
`;
