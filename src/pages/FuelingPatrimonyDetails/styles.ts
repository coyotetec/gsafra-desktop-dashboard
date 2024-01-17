import { DataTable } from 'primereact/datatable';
import styled from 'styled-components';

export const Container = styled.main`
  .filters {
    margin-top: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;

    .date-filter {
      display: grid;
      grid-template-columns: 1fr 24px 1fr;
      place-items: center;

      strong {
        font-size: 16px;
        font-weight: 500;
        margin-top: 16px;
      }
    }
  }

  .export-button {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00d47e;
    border-radius: 8px;
    border: none;
    margin-top: 24px;
    margin-left: auto;
  }
`;

export const Table = styled(DataTable)`
  margin-top: 8px;
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

  .p-row-toggler {
    color: #9fa9ac !important;
    margin-right: 8px;

    &:hover,
    &:active,
    &:focus {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }
  }
`;
