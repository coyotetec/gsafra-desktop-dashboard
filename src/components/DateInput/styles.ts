import styled from 'styled-components';

interface WrapperProps {
  height?: string;
  width?: string;
  fontSize?: string;
  horizontalPadding?: string;
}

export const Wrapper = styled.div<WrapperProps>`
  label {
    font-size: 12px;
    font-weight: 500;
    color: #9FA9AC;
    margin-bottom: 4px;
    display: block;
  }

  input {
    height: ${({ height }) => height ? height : '36px'};
    width: ${({ width }) => width ? width : '100px'};
    display: flex;
    align-items: center;
    padding: 0 ${({ horizontalPadding }) => horizontalPadding ? horizontalPadding : '8px'};
    background: #30454C;
    border-radius: 8px;
    border: 1px solid #506167;
    outline: none;
    font-family: 'Montserrat', sans-serif;
    font-size: ${({ fontSize }) => fontSize ? fontSize : '14px'};
    color: #CFD4D6;

    &::placeholder {
      color: #748990;
    }
  }
`;
