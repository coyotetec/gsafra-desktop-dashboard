import TreeNode from 'primereact/treenode';
import { PlanoContasFinancial } from '../../../types/PlanoContas';

function findChildren(
  parent: any,
  items: any[],
  index: number,
  months: string[]
): TreeNode {
  const children = items.filter(
    (item) =>
      item.codigo.split('.').length === index + 1 &&
      item.codigo.startsWith(`${parent.codigo}.`)
  );
  const data: any = {
    name: `${parent.codigo} - ${parent.descricao}`,
    total: parent.total
  };

  months.forEach((month, index) => {
    data[`month${index}`] = parent[`month${index}`];
  });

  if (children.length === 0) {
    return {
      key: parent.codigo,
      data,
    };
  }

  return {
    key: parent.codigo,
    data,
    children: children.map((child) => findChildren(child, items, index + 1, months)),
  };
}

export function parseChartAccounts(chartAccounts: PlanoContasFinancial[], months: string[]) {
  const firstParents = chartAccounts.filter(
    (item) => item.codigo.split('.').length === 1
  );

  return firstParents.map((parent) => findChildren(parent, chartAccounts, 1, months));
}
