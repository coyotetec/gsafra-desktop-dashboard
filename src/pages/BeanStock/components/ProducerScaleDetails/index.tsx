import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { Column } from 'primereact/column';
import { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Select } from '../../../../components/Select';
import { useUserContext } from '../../../../contexts/UserContext';
import { change, setFirstProducerDetails } from '../../../../redux/features/beanStockFiltersSlice';
import { RootState } from '../../../../redux/store';
import { EstoqueGraosProdutor } from '../../../../types/EstoqueGraos';
import { Container, Table } from './styles';

type optionType = {
  value: string;
  label: string;
}[]

export function ProducerScaleDetails() {
  const chartRef = useRef(null);

  const {
    beanStockFilters: { selectedProducerDetail },
    beanStockData: {
      beanStockProducer: {
        estoqueGraosProdutor
      }
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const producersOptions = useMemo<optionType>(() => {
    dispatch(setFirstProducerDetails(String(estoqueGraosProdutor[0].idProdutor)));

    return estoqueGraosProdutor.map((item) => ({
      value: String(item.idProdutor),
      label: item.produtor
    }));
  }, [dispatch, estoqueGraosProdutor]);

  const selectedProducerBeansStock = useMemo<EstoqueGraosProdutor>(() => {
    const beanStock = estoqueGraosProdutor.find(
      (item) => item.idProdutor === Number(selectedProducerDetail)
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
  }, [estoqueGraosProdutor, selectedProducerDetail]);

  const { hasPermission } = useUserContext();

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id', {
      maximumFractionDigits: 2,
    }).format(number)}${sufix ? sufix : ''}`;
  }

  function handleSaveChart() {
    const chartElement = chartRef.current;

    if (!chartElement) {
      return;
    }

    html2canvas(chartElement, {
      backgroundColor: null,
      imageTimeout: 0,
      scale: 2,
    }).then((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.target = '_blank';
      a.download = `SALDO ${producersOptions.find((i) => i.value === selectedProducerDetail)?.label || ''} - VISÃO DETALHADA`;
      a.click();
    });
  }

  return (
    <Container>
      <header>
        <h3>
          VISÃO DETALHADA
        </h3>
        <Select
          options={producersOptions}
          value={selectedProducerDetail}
          onChange={(value: string) => {
            dispatch(change({
              name: 'selectedProducerDetail',
              value,
            }));
          }}
          width="320px"
          height="40px"
        />
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('estoque_graos_produtor') && <NotAllowed />}
        <header>
          <div className="total">
            <span>
              <strong>Saldo Anterior: </strong>
              {formatNumber(selectedProducerBeansStock.saldoAnterior || 0, ' Kg')}
            </span>
            <span>
              <strong>Saldo Final: </strong>
              {formatNumber(selectedProducerBeansStock.saldoFinal || 0, ' Kg')}
            </span>
          </div>
          <button onClick={handleSaveChart} data-html2canvas-ignore>
            <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
          </button>
        </header>
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
