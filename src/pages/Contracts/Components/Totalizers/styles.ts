import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  background: #30454c;
  border-radius: 8px;
  border: 1px solid #506167;
  position: relative;

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 360px;

    img {
      width: 160px;
    }

    strong {
      margin-top: 12px;
    }

    span {
      font-size: 14px;
    }
  }

  .total-contract {
    display: grid;
    grid-template-columns: 2fr 4fr 1fr;
    gap: 12px;
    font-size: 14px;

    .contract-progress {
      .progressbar {
        width: 100%;
        height: 36px;
        background: #506167;
        border: 1px solid #748990;
        border-radius: 8px;
        overflow: hidden;
        position: relative;

        .bar {
          height: 100%;
          background: #00d47e;
        }

        .overbar {
          height: 100%;
          background: #ff5555;
          position: absolute;
          right: 0;
          top: 0;
        }

        strong {
          color: #f7fbfe;
          font-weight: 600;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .info {
        margin-top: 8px;

        span {
          display: block;

          & + span {
            margin-top: 4px;
          }
        }
      }
    }

    .contract-value {
      strong {
        display: block;
      }
    }
  }

  footer {
    display: flex;
    justify-content: center;
    gap: 12px;

    button {
      background: transparent;
      border: none;
      transition: all 0.3s ease-in-out;
      padding: 4px;

      &[aria-label='página anterior']:hover {
        transform: translateX(-4px);
      }

      &[aria-label='próxima página']:hover {
        transform: translateX(4px);
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
