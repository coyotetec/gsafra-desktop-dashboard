import { DataTable } from 'primereact/datatable';
import styled, { css, keyframes } from 'styled-components';

const cardIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

const cardOut = keyframes`
  from { transform: scale(1); }
  to { transform: scale(0); }
`;

export const Container = styled.div`
  margin-top: 32px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    h3 {
      font-size: 14px;
      font-weight: 600;
    }
  }

  .cards {
    margin-top: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 16px;

    .card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      background: #30454c;
      border-radius: 8px;
      border: 1px solid #506167;
      position: relative;
      overflow: hidden;

      > strong {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 500;
        line-height: 150%;
      }

      > span {
        font-size: 20px;
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
        margin-top: 4px;
      }
    }
  }
`;

interface DetailsWrapperProps {
  isLeaving: boolean;
}

export const DetailWrapper = styled.div<DetailsWrapperProps>`
  margin-top: 20px;
  transform-origin: top left;
  animation: ${cardIn} 0.4s;

  ${({ isLeaving }) =>
    isLeaving &&
    css`
      animation: ${cardOut} 0.3s forwards;
    `}

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

    h3 {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .close-button {
      position: absolute;
      top: 12px;
      right: 12px;
      background: transparent;
      border: none;
      display: flex;
      cursor: pointer;
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

export const Table = styled(DataTable)`
  margin-top: 12px;
  font-family: 'Montserrat', sans-serif;
  color: #cfd4d6 !important;
  font-size: 14px;

  .p-datatable-wrapper {
    border-radius: 8px !important;
    border: none;
    overflow: hidden;
  }

  .p-datatable-table {
    border-radius: 8px !important;
  }

  .p-datatable-thead {
    tr {
      th {
        border-color: #748990 !important;
        color: #cfd4d6;
        background: #506167;
        padding: 8px 12px;
        font-weight: 600;
      }
    }
  }

  .p-datatable-tbody {
    .p-rowgroup-header {
      background: #506167;

      td {
        border-color: #748990 !important;
      }
    }

    tr {
      color: #cfd4d6;
      background: #30454c;

      td {
        border: none !important;
        background: rgba(116, 137, 144, 0.2) !important;
        padding: 8px 12px;
      }
    }

    .p-datatable-emptymessage {
      td {
        text-align: center;
        padding: 24px;
        font-weight: 600;
      }
    }
  }

  .p-paginator {
    font-family: 'Montserrat', sans-serif;
    color: #cfd4d6 !important;
    background: transparent !important;
    border: none;
    padding: 0;

    button {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;

      &:disabled {
        opacity: 1;
        .p-paginator-icon {
          color: #748990 !important;
        }
      }

      .p-paginator-icon {
        color: #cfd4d6;
      }
    }
  }
`;
