import { TreeSelect } from 'primereact/treeselect';
import styled, { css } from 'styled-components';

interface StyledTreeSelectProps {
  isSecondary: boolean;
}

export const StyledTreeSelect = styled(TreeSelect) <StyledTreeSelectProps>`
  height: 48px;
  background: #30454C;
  border: 1px solid #506167;
  border-radius: 8px;
  font-size: 16px !important;
  font-family: 'Montserrat', sans-serif !important;

  ${({ isSecondary }) => isSecondary && css`
    background: #506167;
    border: 1px solid #748990;
  `}

  &:not(.p-disabled):hover,
  &:not(.p-disabled).p-focus {
    border-color: #506167 !important;
    box-shadow: none;

    ${({ isSecondary }) => isSecondary && css`
      border-color: #748990 !important;
    `}
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
