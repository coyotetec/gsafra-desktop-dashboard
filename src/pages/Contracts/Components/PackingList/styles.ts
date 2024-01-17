import { DataTable } from 'primereact/datatable';
import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 20px;

  > header {
    h3 {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .filters {
      margin-top: 12px;
      display: flex;
      gap: 12px;

      .date-filter {
        display: grid;
        grid-template-columns: 1fr 24px 1fr;
        place-items: center;

        strong {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }

  .table-wrapper {
    position: relative;
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
  border-radius: 8px;
`;

export const Table = styled(DataTable)`
  margin-top: 12px;
  font-family: 'Montserrat', sans-serif;
  color: #cfd4d6 !important;
  font-size: 14px;

  .p-datatable-wrapper {
    border-radius: 8px !important;
    border: 1px solid #748990 !important;
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
        border-color: #506167 !important;
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
