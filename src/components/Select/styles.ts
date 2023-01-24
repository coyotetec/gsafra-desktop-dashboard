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
  width: ${({width}) => width ? width : '280px'};
  height: 48px;
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
    font-family: 'Montserrat', sans-serif !important;
    color: #CFD4D6;
    display: flex;
    align-items: center;
  }

  .p-dropdown-trigger {
    color: #CFD4D6;
  }
`;
