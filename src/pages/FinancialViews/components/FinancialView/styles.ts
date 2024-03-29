import styled from 'styled-components';

export const Container = styled.div`
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
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
    background: #30454c;
    border-radius: 8px;
    border: 1px solid #506167;
    margin-top: 8px;
    position: relative;

    .totalizers {
      margin-top: 8px;

      .totalizer-item {
        width: 100%;
        background: #506167;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;

        & + .totalizer-item {
          margin-top: 8px;
        }

        &.has-error span {
          color: #ff5555;
          font-size: 14px;
        }

        &.negative span {
          color: #ff5555;
        }

        strong {
          font-weight: 500;
          /* display: block; */
        }

        span {
          font-weight: 600;
          font-size: 16px;
        }
      }
    }

    > footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;

      button {
        background: transparent;
        border: none;
        display: flex;
      }

      a {
        color: #00d47e;
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
