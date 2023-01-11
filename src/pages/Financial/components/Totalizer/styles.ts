import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const totalizerDetailIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

const totalizerDetailOut = keyframes`
  from { transform: scale(1); }
  to { transform: scale(0); }
`;

interface DetailProps {
  readonly isLeaving: boolean;
}

export const Container = styled.section`
  margin-top: 32px;

  header {
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
  }

  .modal-button {
    background: transparent;
    border: 0;
    margin-left: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translateY(4px);
  }
`;

export const CardsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-top: 8px;

  .card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    background: #30454C;
    border-radius: 8px;
    border: 1px solid #506167;
    position: relative;

    > strong {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 500;
      line-height: 150%;
    }

    > span {
      font-size: 24px;
      font-weight: 600;
      display: block;
      margin-top: 8px;
      display: inline-flex;
      align-items: center;

      button {
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        margin-left: 8px;
        cursor: pointer;
      }
    }

    > small {
      display: block;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 24px;
    }

    footer {
      margin-top: auto;

      span {
        display: block;
        line-height: 150%;
        font-size: 14px;
        font-weight: 400;

        small {
          font-size: 14px;
          font-weight: 600;
          margin-left: 4px;
        }
      }

      .progress-bar {
        width: 100%;
        height: 4px;
        background: #506167;
        border-radius: 999px;
        margin-bottom: 8px;

        .progress-bar-inner {
          height: 100%;
          background: #00D47E;
          border-radius: 999px;
        }
      }
    }
  }
`;

export const DetailTitle = styled.h3<DetailProps>`
  margin-top: 20px !important;
  animation: ${fadeIn} 0.4s;

  ${({ isLeaving }) => isLeaving && css`
    animation: ${fadeOut} 0.3s forwards;
  `}
`;

export const Detail = styled.div<DetailProps>`
  margin-top: 8px;
  padding: 16px;
  width: 100%;
  background: #30454C;
  border-radius: 8px;
  border: 1px solid #506167;
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  gap: 24px;
  transform-origin: top left;
  animation: ${totalizerDetailIn} 0.4s;
  position: relative;

  ${({ isLeaving }) => isLeaving && css`
    animation: ${totalizerDetailOut} 0.3s forwards;
  `}

  .close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    display: flex;
    cursor: pointer;
  }

  section {
    strong {
      font-weight: 500;
      line-height: 150%;
      display: block;
      font-size: 14px;
    }

    span {
      font-size: 20px;
      font-weight: 600;
      display: block;
      margin-top: 8px;
      display: inline-flex;
      align-items: center;
    }

    small {
      font-size: 14px;
      margin-left: 4px;
    }

    ul {
      margin-left: 32px;
      margin-top: 12px;

      li {
        line-height: 150%;
        font-size: 14px;
        font-weight: 400;

        small {
          font-size: 14px;
          font-weight: 600;
          margin-left: 4px;
        }
      }
    }
  }

  .separator {
    width: 2px;
    height: 100%;
    background: #506167;
  }
`;
