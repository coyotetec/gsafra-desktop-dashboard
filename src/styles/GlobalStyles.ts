import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    background: #102830;
    color: #CFD4D6;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      background: #102830;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #506167;
      border-radius: 999px;
      border: 3px solid #102830;
    }
  }

  button {
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    color: #CFD4D6;
  }

  strong {
    font-weight: 600;
  }

  .p-treeselect-panel {
    background: #506167;
    border-radius: 8px;
    max-width: 420px;
    border: 1px solid #748990;

    .p-treeselect-header {
      padding: 4px;
      background: #30454C;
      border-color: #748990;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;

      button {
        color: #9FA9AC !important;

        &:hover, &:active, &:focus {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      }
    }

    .p-treeselect-items-wrapper {
      background: #506167;
      border-bottom-right-radius: 8px;
      border-bottom-left-radius: 8px;
      max-height: 320px !important;

      &::-webkit-scrollbar {
        width: 12px;
      }

      &::-webkit-scrollbar-track {
        background: #506167;
        border-radius: 999px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #748990;
        border-radius: 999px;
        border: 3px solid #506167;
      }

      .p-tree {
        padding: 0;
        background: #506167;
        color: #CFD4D6;
        font-size: 16px !important;
        font-family: 'Montserrat', sans-serif !important;

        button {
          color: #CFD4D6 !important;

          &:hover, &:active, &:focus {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
        }

        .p-treenode-content {
          padding: 6px;

          &:hover, &:active, &:focus {
            background: #748990 !important;
            color: #CFD4D6 !important;
            box-shadow: none !important;
          }

          &.p-highlight {
            background: #00D47E !important;
            color: #F7FBFE !important;
            font-weight: 500;

            button {
              color: #F7FBFE !important;
            }
          }
        }

        .p-treenode-children {
          padding: 0 0 0 8px;
        }
      }
    }
  }

  .p-dropdown-panel {
    background: #506167;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    border: 1px solid #748990;

    .p-dropdown-items-wrapper {
      max-width: 320px;
      max-height: 280px !important;

      &::-webkit-scrollbar {
        width: 12px;
      }

      &::-webkit-scrollbar-track {
        background: #506167;
        border-radius: 999px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #748990;
        border-radius: 999px;
        border: 3px solid #506167;
      }

      .p-dropdown-item {
          padding: 12px 16px;
          color: #CFD4D6 !important;
          white-space: normal;

          &:hover, &:active, &:focus {
            background: #748990 !important;
            color: #CFD4D6 !important;
            box-shadow: none !important;
          }

          &.p-highlight {
            background: #00D47E !important;
            color: #F7FBFE !important;
            font-weight: 500;

            button {
              color: #F7FBFE !important;
            }
          }
        }
    }
  }
`;
