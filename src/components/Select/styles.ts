import { Dropdown } from 'primereact/dropdown';
import styled from 'styled-components';

export const Wrapper = styled.div`
  > span {
    font-size: 12px;
    font-weight: 500;
    color: #9FA9AC;
    margin-bottom: 4px;
    display: block;
  }
`;

export const StyledSelect = styled(Dropdown)`
  width: ${({ width }) => width ? width : '280px'};
  height: ${({ height }) => height ? height : '48px'};
  background: #30454C;
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

  .p-dropdown-label {
    width: 100px;
    color: #CFD4D6;
    font-family: 'Montserrat', sans-serif !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 1px !important;
  }

  .p-dropdown-trigger {
    color: #CFD4D6 !important;
  }

  .p-dropdown-clear-icon {
    color: #FF5555 !important;
  }
`;

export const OptionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #F7FBFE;
`;
