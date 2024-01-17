import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    font-size: 14px;
  }
`;

export const Container = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider::before {
      transform: translateX(20px);
    }
  }

  .slider {
    margin-top: 0 !important;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #102830;
    border-radius: 999px;

    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background: #f7fbfe;
      transition: all 0.3s ease-in-out;
      border-radius: 999px;
    }
  }
`;
