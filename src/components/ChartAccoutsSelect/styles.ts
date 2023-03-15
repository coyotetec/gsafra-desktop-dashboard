import { TreeSelect } from 'primereact/treeselect';
import styled from 'styled-components';

export const StyledTreeSelect = styled(TreeSelect)`
  height: 48px;
  background: #506167;
  border: 1px solid #748990;
  border-radius: 8px;
  font-size: 16px !important;
  font-family: 'Montserrat', sans-serif !important;


  &:not(.p-disabled):hover,
  &:not(.p-disabled).p-focus {
    border-color: #748990 !important;
    box-shadow: none;
  }

  .p-treeselect-label-container {
    display: flex;
    align-items: center;

    .p-treeselect-label {
      width: 360px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .p-placeholder {
    color: #748990 !important;
  }

  .p-treeselect-trigger {
    color: #CFD4D6;
  }
`;
