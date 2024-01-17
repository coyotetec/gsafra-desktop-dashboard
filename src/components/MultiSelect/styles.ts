import { MultiSelect } from 'primereact/multiselect';
import styled from 'styled-components';

export const Wrapper = styled.div`
  > span {
    font-size: 12px;
    font-weight: 500;
    color: #9fa9ac;
    margin-bottom: 4px;
    display: block;
  }
`;

export const StyledMultiSelect = styled(MultiSelect)`
  width: ${({ width }) => width || '280px'};
  height: ${({ height }) => height || '48px'};
  background: #30454c;
  border-radius: 8px;
  border: 1px solid #506167;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif !important;

  &:not(.p-disabled):hover {
    border-color: #506167 !important;
  }

  &:not(.p-disabled).p-focus {
    border-color: #506167 !important;
    box-shadow: none;
  }

  .p-multiselect-label-container {
    width: 100px;
    color: #cfd4d6;
    font-family: 'Montserrat', sans-serif !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .p-multiselect-trigger {
    color: #cfd4d6;
  }
`;
