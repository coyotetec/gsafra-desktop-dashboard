import styled from 'styled-components';

export const Container = styled.section`
  margin-top: 54px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const Content = styled.header`
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;

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
  }

  .card {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background: #30454C;
    border-radius: 8px;
    border: 1px solid #506167;
    margin-top: 8px;
    position: relative;
    overflow: hidden;

    > footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        background: transparent;
        border: none;
        display: flex;
      }

      a {
        color: #00D47E;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
`;

export const Loader = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(48, 69, 76, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
