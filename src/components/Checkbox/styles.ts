import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 3px;
    cursor: pointer;
  }

  label {
    font-size: 14px;
    font-weight: 600;
    user-select: none;
    cursor: pointer;
  }
`;

export const StyledCheckbox = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  appearance: none;
  width: 24px;
  height: 24px;
  background: #30454c;
  border-radius: 4px;
  border: 1px solid #506167;
  cursor: pointer;

  &:checked {
    background: #00d47e;
  }
`;
