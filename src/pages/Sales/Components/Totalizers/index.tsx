import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, DownloadSimple } from 'phosphor-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import VendaService from '../../../../services/VendaService';
import { toast } from '../../../../utils/toast';
import { Container, Loader } from './styles';
import emptyIllustration from '../../../../assets/images/empty.svg';
import { Spinner } from '../../../../components/Spinner';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { setSales } from '../../../../redux/features/salesDataSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { componentsRefType } from '../../../../types/Types';

interface TotalizersProps {
  safraName: string;
}

const ITEMS_PER_PAGE = 4;

export const Totalizers = forwardRef<componentsRefType, TotalizersProps>(
  ({ safraName }, ref) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const chartRef = useRef(null);
    const isFirstRender = useRef(true);

    const {
      salesFilters: { rangeDates, safra, deliveryStatus },
      salesData: { sales, salesLastFetch },
    } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();

    const salesToShow = useMemo(
      () =>
        sales.slice(
          currentPage * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
        ),
      [sales, currentPage],
    );

    const { hasPermission } = useUserContext();

    const loadData = useCallback(async () => {
      if (hasPermission('vendas_por_cliente')) {
        setIsLoading(true);

        if (isFirstRender.current) {
          isFirstRender.current = false;

          if (!hasToFetch(salesLastFetch)) {
            setIsLoading(false);
            return;
          }
        }

        if (safra === '_') {
          setIsLoading(false);
          return;
        }

        if (
          rangeDates.endDate &&
          rangeDates.startDate &&
          rangeDates.endDate < rangeDates.startDate
        ) {
          setIsLoading(false);
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!',
          });
          return;
        }

        const deliveryStatusParsed =
          deliveryStatus !== '_' ? deliveryStatus : '';
        const startDateParsed = rangeDates.startDate
          ? format(rangeDates.startDate, 'dd-MM-yyyy')
          : '';
        const endDateParsed = rangeDates.endDate
          ? format(rangeDates.endDate, 'dd-MM-yyyy')
          : '';

        const salesData = await VendaService.findVendas({
          safraId: Number(safra),
          deliveryStatus: deliveryStatusParsed,
          startDate: startDateParsed,
          endDate: endDateParsed,
        });

        dispatch(setSales(salesData));
      }
      setIsLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      deliveryStatus,
      dispatch,
      hasPermission,
      rangeDates.endDate,
      rangeDates.startDate,
      safra,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        loadData,
      }),
      [loadData],
    );

    useEffect(() => {
      setCurrentPage(0);
    }, [sales]);

    useEffect(() => {
      loadData();
    }, [loadData]);

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
        a.download = `VENDAS POR CLIENTE - ${safraName}`;
        a.click();
      });
    }

    function formatNumber(number: number, sufix?: string) {
      return `${new Intl.NumberFormat('id', {
        maximumFractionDigits: 2,
      }).format(number)}${sufix || ''}`;
    }

    return (
      <Container>
        <header>
          <h3>VENDAS POR CLIENTE</h3>
        </header>
        <div className="card" ref={chartRef}>
          {!hasPermission('vendas_por_cliente') && <NotAllowed />}
          {isLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          {sales.length === 0 ? (
            <div className="empty">
              <img src={emptyIllustration} alt="Ilustração de vazio" />
              <strong>Nenhum dado encontrado</strong>
              <span>Tente selecionar outra safra.</span>
            </div>
          ) : (
            salesToShow.map((sale) => (
              <div key={sale.idCliente} className="total">
                <span>{sale.cliente}</span>
                <div className="progress">
                  <div className="progressbar">
                    <div
                      className="bar"
                      style={{
                        width:
                          sale.porcentagem > 100
                            ? `${100 - ((sale.porcentagem - 100) * 100) / sale.porcentagem}%`
                            : `${sale.porcentagem}%`,
                      }}
                    ></div>
                    {sale.porcentagem > 100 && (
                      <div
                        className="overbar"
                        style={{
                          width: `${((sale.porcentagem - 100) * 100) / sale.porcentagem}%`,
                        }}
                      ></div>
                    )}
                    <strong>{formatNumber(sale.porcentagem, '%')}</strong>
                  </div>
                  <div className="info">
                    <span>
                      <strong>Entregue: </strong>
                      {formatNumber(sale.totalEntregue, ' Kg')} /{' '}
                      {formatNumber(sale.totalEntregue / 60, ' Sacas')}
                    </span>
                    <span>
                      <strong>Saldo: </strong>
                      {formatNumber(
                        sale.total - sale.totalEntregue,
                        ' Kg',
                      )} /{' '}
                      {formatNumber(
                        (sale.total - sale.totalEntregue) / 60,
                        ' Sacas',
                      )}
                    </span>
                  </div>
                </div>
                <div className="value">
                  <strong>{formatNumber(sale.total, ' Kg')}</strong>
                  <strong>{formatNumber(sale.total / 60, ' Sacas')}</strong>
                </div>
              </div>
            ))
          )}
          {sales.length > ITEMS_PER_PAGE && (
            <div className="paginator">
              {currentPage > 0 && (
                <button
                  aria-label="página anterior"
                  onClick={() => setCurrentPage((prevState) => prevState - 1)}
                >
                  <ArrowLeft size={20} color="#F7FBFE" weight="regular" />
                </button>
              )}

              {currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE < sales.length && (
                <button
                  aria-label="próxima página"
                  onClick={() => setCurrentPage((prevState) => prevState + 1)}
                >
                  <ArrowRight size={20} color="#F7FBFE" weight="regular" />
                </button>
              )}
            </div>
          )}
          <footer data-html2canvas-ignore>
            <Link
              to={`romaneios?safraId=${safra}&startDate=${
                rangeDates.startDate
                  ? format(rangeDates.startDate, 'dd-MM-yyyy')
                  : '_'
              }&endDate=${
                rangeDates.endDate
                  ? format(rangeDates.endDate, 'dd-MM-yyyy')
                  : '_'
              }&status=${deliveryStatus}`}
            >
              Visão Detalhada
            </Link>
            <button onClick={handleSaveChart}>
              <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
            </button>
          </footer>
        </div>
      </Container>
    );
  },
);

Totalizers.displayName = 'Totalizers';
