import styled from 'styled-components';

export const Container = styled.section`
  margin-top: 54px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  h3 {
    font-size: 14px;
    font-weight: 600;
  }

  > div {
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
