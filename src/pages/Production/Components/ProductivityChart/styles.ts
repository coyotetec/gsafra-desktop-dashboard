import styled from 'styled-components';

export const Container = styled.div`
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

  footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 8px;

    button {
      background: transparent;
      border: none;
      transition: all 0.3s ease-in-out;

      &[aria-label="página anterior"]:hover {
        transform: translateX(-4px);
      }

      &[aria-label="próxima página"]:hover {
        transform: translateX(4px);
      }
    }
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 360px;
  position: relative;
`;
