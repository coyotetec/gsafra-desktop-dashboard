import { Column } from 'primereact/column';
import { useMemo, useState } from 'react';
import { Select } from '../../../../components/Select';
import { EstoqueGraosProdutor } from '../../../../types/EstoqueGraos';
import { Container, Table } from './styles';

interface ProducerScaleDetailsProps {
  producersBeansStock: EstoqueGraosProdutor[];
}

type optionType = {
  value: string;
  label: string;
}[]

export function ProducerScaleDetails({ producersBeansStock }: ProducerScaleDetailsProps) {
  const [selectedProducer, setSelectedProducer] = useState('_');
  const producersOptions = useMemo<optionType>(() => {
    setSelectedProducer(String(producersBeansStock[0].idProdutor));

    return producersBeansStock.map((item) => ({
      value: String(item.idProdutor),
      label: item.produtor
    }));
  }, [producersBeansStock]);
  const selectedProducerBeansStock = useMemo<EstoqueGraosProdutor>(() => {
    const beanStock = producersBeansStock.find(
      (item) => item.idProdutor === Number(selectedProducer)
    );

    if (!beanStock) {
      return {
        saldoAnterior: 0,
        saldoFinal: 0,
        idProdutor: 0,
        produtor: 'NENHUM',
        entradas: {
          peso: 0,
          descontoClassificacao: 0,
          taxaRecepcao: 0,
          cotaCapital: 0,
          taxaArmazenamento: 0,
          quebraTecnica: 0,
          pesoLiquido: 0
        },
        saidas: {
          peso: 0,
          descontoClassificacao: 0,
          pesoLiquido: 0
        }
      };
    }

    return beanStock;
  }, [producersBeansStock, selectedProducer]);

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id', {
      maximumFractionDigits: 2,
    }).format(number)}${sufix ? sufix : ''}`;
  }

  return (
    <Container>
      <header>
        <h3>
          VISÃO DETALHADA
        </h3>
        <Select
          options={producersOptions}
          value={selectedProducer}
          onChange={setSelectedProducer}
          width="320px"
          height="40px"
        />
      </header>
      <div className="card">
        <span>
          <strong>Saldo Anterior: </strong>
          {formatNumber(selectedProducerBeansStock.saldoAnterior || 0, ' Kg')}
        </span>
        <span>
          <strong>Saldo Final: </strong>
          {formatNumber(selectedProducerBeansStock.saldoFinal || 0, ' Kg')}
        </span>

        <section>
          <h4>Entradas</h4>
          <Table
            value={[selectedProducerBeansStock.entradas]}
          >
            <Column header="Peso (Bruto - Tara)" body={(rowData) => formatNumber(rowData?.peso, ' Kg')} />
            <Column header="Desc. Classific." body={(rowData) => formatNumber(rowData?.descontoClassificacao, ' Kg')} />
            <Column header="Taxa Recepção" body={(rowData) => formatNumber(rowData?.taxaRecepcao, ' Kg')} />
            <Column header="Cota Capital" body={(rowData) => formatNumber(rowData?.cotaCapital, ' Kg')} />
            <Column header="Taxa Armazenamento" body={(rowData) => formatNumber(rowData?.taxaArmazenamento, ' Kg')} />
            <Column header="Quebra Técnica" body={(rowData) => formatNumber(rowData?.quebraTecnica, ' Kg')} />
            <Column style={{ minWidth: 120 }} header="Peso Liquido" body={
              (rowData) => <strong>{formatNumber(rowData?.pesoLiquido, ' Kg')}</strong>
            } />
          </Table>
        </section>
        <section>
          <h4>Saidas</h4>
          <Table
            value={[selectedProducerBeansStock.saidas]}
          >
            <Column header="Peso (Bruto - Tara)" body={(rowData) => formatNumber(rowData?.peso, ' Kg')} />
            <Column header="Desc. Classific." body={(rowData) => formatNumber(rowData?.descontoClassificacao, ' Kg')} />
            <Column style={{ minWidth: 120 }} header="Peso Liquido" body={
              (rowData) => <strong>{formatNumber(rowData?.pesoLiquido, ' Kg')}</strong>
            } />
          </Table>
        </section>
      </div>
    </Container>
  );
}
