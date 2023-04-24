import styled from 'styled-components';
import { TreeTable } from 'primereact/treetable';

export const Container = styled.main`
  .filters {
    margin-top: 32px;
    display: flex;
    gap: 12px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
    margin-top: 16px;

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

  .table-wrapper {
    position: relative;
  }
`;

export const Table = styled(TreeTable)`
  margin-top: 8px;
  font-family: 'Montserrat', sans-serif;
  color: #CFD4D6 !important;
  font-size: 14px;
  border-radius: 8px !important;
  overflow: hidden;
  background: #30454C !important;

  .p-treetable-scrollable-body {

    &::-webkit-scrollbar-corner {
      background: #30454C;
    }

    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    &::-webkit-scrollbar-track {
      background: #30454C;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #506167;
      border-radius: 999px;
      border: 3px solid #30454C;
    }
  }

  .p-treetable-scrollable-header {
    background-color: #506167;
    border-bottom: 1px solid #748990;
  }

  .p-treetable-wrapper {
    border-radius: 8px !important;
    border: 1px solid #748990 !important;

    table {
      border-radius: 8px !important;
    }
  }

  .p-treetable-thead {
    tr {
      th {
        border: none !important;
        color: #CFD4D6;
        background: #506167;
        padding: 8px 12px;
        font-weight: 600;
      }
    }
  }

  .p-treetable-tbody {
    tr {
      color: #CFD4D6;
      background: #30454C;
      outline: none !important;

      td {
        border-color: #506167;
        padding: 12px 8px;
      }
    }

    .p-treetable-toggler {
      color: #9FA9AC !important;
      width: 16px !important;
      height: 16px !important;
      margin-right: 8px !important;

      .pi {
        width: 12px !important;
        font-size: 12px !important;
      }

      &:hover, &:active, &:focus {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
    }

    .p-treetable-emptymessage {
      text-align: center;
      padding: 24px;
      font-weight: 600;
    }
  }

  .p-treetable-scrollable-footer {
    background: #445359 !important;
  }

  .p-treetable-tfoot {
    tr {
      td {
        border: none !important;
        color: #CFD4D6;
        background: #445359;
        padding: 10px 8px;
        font-weight: 600;
      }
    }
  }

  .p-treetable-footer {
    border: none !important;
    color: #CFD4D6;
    background: #506167;
    padding: 12px 16px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #748990;
    border-bottom: none;

    span {
      font-weight: 600;
    }

    strong {
      font-weight: 400;
      margin-right: 8px;
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
  border-radius: 8px;
`;

