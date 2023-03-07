import { DataTable } from 'primereact/datatable';
import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 20px;
  transform-origin: top left;

  > header {
    display: flex;
    gap: 8px;
    align-items: flex-end;

    h3 {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    div {
      display: flex;
      gap: 8px;
      align-items: center;

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

    .close-button {
      position: absolute;
      top: 12px;
      right: 12px;
      background: transparent;
      border: none;
      display: flex;
      cursor: pointer;
    }

    header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0;

      span {
        font-weight: 600;
        font-size: 16px;
        display: block;
        margin-top: 2px;

        strong {
          font-size: 14px;
          font-weight: 500;
        }
      }

      button {
        background: transparent;
        border: none;
        display: flex;
      }
    }

    section {
      margin-top: 16px;

      h4 {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
      }
    }
  }
`;

export const Table = styled(DataTable)`
  margin-top: 8px;
  font-family: 'Montserrat', sans-serif;
  color: #CFD4D6 !important;
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
        color: #CFD4D6;
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
      color: #CFD4D6;
      background: #30454C;

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
    color: #CFD4D6 !important;
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
        color: #CFD4D6;
      }
    }
  }
`;
