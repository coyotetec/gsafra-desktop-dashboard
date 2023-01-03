import styled from 'styled-components';

export const Wrapper = styled.div`
  label {
    margin-bottom: 4px;
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #9FA9AC;
  }

  input {
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    background: #30454C;
    border-radius: 8px;
    border: 1px solid #506167;
    outline: none;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    width: 100px;
    color: #CFD4D6;

    &::placeholder {
      color: #748990;
    }
  }
`;
