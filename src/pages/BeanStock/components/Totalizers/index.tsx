import { format } from 'date-fns';
import { ArrowCircleDown, ArrowCircleRight, ArrowCircleUp, ChartLine, Scales, X } from 'phosphor-react';
import { Column } from 'primereact/column';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Spinner } from '../../../../components/Spinner';
import { useUserContext } from '../../../../contexts/UserContext';
import useAnimatedUnmount from '../../../../hooks/useAnimatedUnmount';
import { setBeanStock } from '../../../../redux/features/beanStockDataSlice';
import { RootState } from '../../../../redux/store';
import EstoqueGraosService from '../../../../services/EstoqueGraosService';
import { componentsRefType } from '../../../../types/Types';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { Container, DetailWrapper, Loader, Table } from './styles';

export const Totalizers = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [entriesIsVisible, setEntrieIsVisible] = useState(false);
  const [departuresIsVisible, setDepartureIsVisible] = useState(false);
  const isFirstRender = useRef(true);

  const {
    beanStockFilters: {
      crop,
      rangeDates,
      producer,
      storage,
      safra,
    },
    beanStockData: {
      beanStock,
      beanStcokLastFetch,
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const {
    shouldRender: entriesShouldRender,
    animatedElementRef: entriesRef
  } = useAnimatedUnmount(entriesIsVisible);

  const {
    shouldRender: departuresShouldRender,
    animatedElementRef: departuresRef
  } = useAnimatedUnmount(departuresIsVisible);

  const loadData = useCallback(async () => {
    if (hasPermission('resumo_estoque_graos')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(beanStcokLastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (crop === '_') {
        setIsLoading(false);
        return;
      }

      const produtorIdParsed = producer !== '_' ? Number(producer) : undefined;
      const armazenamentoIdParsed = storage !== '_' ? Number(storage) : undefined;
      const safraIdParsed = safra !== '_' ? Number(safra) : undefined;
      const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

      const beanStockTotalData = await EstoqueGraosService.findTotal({
        culturaId: Number(crop),
        startDate: startDateParsed,
        endDate: endDateParsed,
        produtorId: produtorIdParsed,
        armazenamentoId: armazenamentoIdParsed,
        safraId: safraIdParsed
      });

      dispatch(setBeanStock(beanStockTotalData));

      setBeanStock(beanStockTotalData);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, dispatch, hasPermission, producer, rangeDates.endDate, rangeDates.startDate, safra, storage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useImperativeHandle(ref, () => ({
    loadData
  }), [loadData]);

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id', {
      maximumFractionDigits: 2,
    }).format(number)}${sufix ? sufix : ''}`;
  }

  return (
    <Container>
      <header>
        <h3>RESUMO</h3>
      </header>
      <div className="cards">
        <div className="card">
          {!hasPermission('resumo_estoque_graos') && <NotAllowed />}
          {isLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          <strong>
            <ChartLine size={24} color="#00D47E" weight="duotone" />
            Saldo Anterior
          </strong>
          <span>{formatNumber(beanStock.saldoAnterior, ' Kg')}</span>
          <small>{formatNumber(beanStock.saldoAnterior / 60, ' Sacas')}</small>
        </div>
        <div className="card">
          {!hasPermission('resumo_estoque_graos') && <NotAllowed />}
          {isLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          <strong>
            <ArrowCircleDown size={24} color="#00D47E" weight="duotone" />
            Entradas
          </strong>
          <span>
            {formatNumber(beanStock.entradas.pesoLiquido, ' Kg')}
            <button
              type="button"
              onClick={() => setEntrieIsVisible(true)}
            >
              <ArrowCircleRight size={24} color="#F7FBFE" weight='fill' />
            </button>
          </span>
          <small>
            {formatNumber(beanStock.entradas.pesoLiquido / 60, ' Sacas')}
          </small>
        </div>
        <div className="card">
          {!hasPermission('resumo_estoque_graos') && <NotAllowed />}
          {isLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          <strong>
            <ArrowCircleUp size={24} color="#00D47E" weight="duotone" />
            Saídas
          </strong>
          <span>
            {formatNumber(beanStock.saidas.pesoLiquido, ' Kg')}
            <button
              type="button"
              onClick={() => setDepartureIsVisible(true)}
            >
              <ArrowCircleRight size={24} color="#F7FBFE" weight='fill' />
            </button>
          </span>
          <small>{formatNumber(beanStock.saidas.pesoLiquido / 60, ' Sacas')}</small>
        </div>
        <div className="card">
          {!hasPermission('resumo_estoque_graos') && <NotAllowed />}
          {isLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          <strong>
            <Scales size={24} color="#00D47E" weight="duotone" />
            Saldo Final
          </strong>
          <span>{formatNumber(beanStock.saldoFinal, ' Kg')}</span>
          <small>{formatNumber(beanStock.saldoFinal / 60, ' Sacas')}</small>
        </div>
      </div>
      {entriesShouldRender && (
        <DetailWrapper ref={entriesRef} isLeaving={!entriesIsVisible}>
          <div className="card">
            <button
              className="close-button"
              onClick={() => setEntrieIsVisible(false)}
            >
              <X size={20} color="#F7FBFE" />
            </button>
            <h3>ENTRADAS - VISÃO DETALHADA</h3>
            <Table
              value={[beanStock.entradas]}
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
          </div>
        </DetailWrapper>
      )}
      {departuresShouldRender && (
        <DetailWrapper ref={departuresRef} isLeaving={!departuresIsVisible}>
          <div className="card">
            <button
              className="close-button"
              onClick={() => setDepartureIsVisible(false)}
            >
              <X size={20} color="#F7FBFE" />
            </button>
            <h3>SAÍDAS - VISÃO DETALHADA</h3>
            <Table
              value={[beanStock.saidas]}
            >
              <Column header="Peso (Bruto - Tara)" body={(rowData) => formatNumber(rowData?.peso, ' Kg')} />
              <Column header="Desc. Classific." body={(rowData) => formatNumber(rowData?.descontoClassificacao, ' Kg')} />
              <Column style={{ minWidth: 120 }} header="Peso Liquido" body={
                (rowData) => <strong>{formatNumber(rowData?.pesoLiquido, ' Kg')}</strong>
              } />
            </Table>
          </div>
        </DetailWrapper>
      )}
    </Container>
  );
});
