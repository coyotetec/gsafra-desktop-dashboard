import TreeNode from 'primereact/treenode';
import { TreeSelectSelectionKeys } from 'primereact/treeselect';
import React, { useCallback, useEffect, useState } from 'react';
import PlanoContaService from '../../services/PlanoContaService';
import { PlanoContas } from '../../types/PlanoContas';
import { StyledTreeSelect } from './styles';

interface ChartAccountsSelectProps {
  type: 'credit' | 'debit'
  selected: TreeSelectSelectionKeys;
  setSelected: React.Dispatch<React.SetStateAction<TreeSelectSelectionKeys>>;
  isSecondary?: boolean
}

export function ChartAccountsSelect({ type, selected, setSelected, isSecondary = false }: ChartAccountsSelectProps) {
  const [nodes, setNodes] = useState<TreeNode[]>([]);

  const findChildren = useCallback((parent: PlanoContas, items: PlanoContas[], index: number): TreeNode => {
    const children = items.filter((item) => (
      item.codigo.split('.').length === index + 1
      && item.codigo.startsWith(`${parent.codigo}.`)
    ));

    if (children.length === 0) {
      return {
        key: parent.codigo,
        label: `${parent.codigo} - ${parent.descricao}`,
        data: `${parent.codigo} - ${parent.descricao}`
      };
    }

    return {
      key: parent.codigo,
      label: `${parent.codigo} - ${parent.descricao}`,
      data: `${parent.codigo} - ${parent.descricao}`,
      children: children.map((child) => findChildren(child, items, index + 1))
    };
  }, []);

  const parseChartAccounts = useCallback((chartAccounts: PlanoContas[]) => {
    const firstParents = chartAccounts.filter((item) => item.codigo.split('.').length === 1);

    return firstParents.map((parent) => findChildren(parent, chartAccounts, 1));
  }, [findChildren]);

  useEffect(() => {
    async function loadPlanoContas() {
      const planoContasData = await PlanoContaService.findPlanoContas(type === 'credit' ? 'receita' : 'despesa', 'sintetica');

      const planoContasTree = parseChartAccounts(planoContasData);

      setNodes(planoContasTree);

      setSelected((prevState) => !prevState ? String(planoContasTree[0].key) : prevState);
    }

    loadPlanoContas();
  }, [type, parseChartAccounts, setSelected]);

  return (
    <StyledTreeSelect
      isSecondary={isSecondary}
      options={nodes}
      value={selected}
      onChange={(e) => setSelected(e.value)}
      placeholder="Plano de Contas"
    />
  );
}
