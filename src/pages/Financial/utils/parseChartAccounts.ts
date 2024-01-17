import TreeNode from 'primereact/treenode';
import { PlanoContas } from '../../../types/PlanoContas';

function findChildren(
  parent: PlanoContas,
  items: PlanoContas[],
  index: number,
): TreeNode {
  const children = items.filter(
    (item) =>
      item.codigo.split('.').length === index + 1 &&
      item.codigo.startsWith(`${parent.codigo}.`),
  );

  if (children.length === 0) {
    return {
      key: parent.codigo,
      label: `${parent.codigo} - ${parent.descricao}`,
      data: `${parent.codigo} - ${parent.descricao}`,
    };
  }

  return {
    key: parent.codigo,
    label: `${parent.codigo} - ${parent.descricao}`,
    data: `${parent.codigo} - ${parent.descricao}`,
    children: children.map((child) => findChildren(child, items, index + 1)),
  };
}

export function parseChartAccounts(chartAccounts: PlanoContas[]) {
  const firstParents = chartAccounts.filter(
    (item) => item.codigo.split('.').length === 1,
  );

  return firstParents.map((parent) => findChildren(parent, chartAccounts, 1));
}
