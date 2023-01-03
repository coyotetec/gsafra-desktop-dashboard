import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TreeSelectSelectionKeys } from 'primereact/treeselect';

import { Container, Content, Loader } from './styles';

import PlanoContaService from '../../../../services/PlanoContaService';
import { ChartAccountsChart } from '../ChartAccountsChart';
import { Spinner } from '../../../../components/Spinner';
import { DateInput } from '../../../../components/DateInput';
import { format, subMonths } from 'date-fns';
import { ChartAccountsSelect } from '../../../../components/ChartAccoutsSelect';
import { UserContext } from '../../../../components/App';
import { NotAllowed } from '../../../../components/NotAllowed';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';

interface ChartAccountsProps {
  safraId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RangeDates {
  startDate: Date;
  endDate: Date;
}

export function ChartAccounts({ safraId }: ChartAccountsProps) {
  const [selectedDebit, setSelectedDebit] = useState<TreeSelectSelectionKeys>(null);
  const [debitLabels, setDebitLabels] = useState<string[]>([]);
  const [debitTotal, setDebitTotal] = useState<number[]>([]);
  const [debitTotalIsLoading, setDebitTotalIsLoading] = useState(true);
  const [selectedCredit, setSelectedCredit] = useState<TreeSelectSelectionKeys>(null);
  const [creditLabels, setCreditLabels] = useState<string[]>([]);
  const [creditTotal, setCreditTotal] = useState<number[]>([]);
  const [creditTotalIsLoading, setCreditTotalIsLoading] = useState(true);
  const [creditRangeDates, setCreditRangeDates] = useState<RangeDates>({
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  });
  const [debitRangeDates, setDebitRangeDates] = useState<RangeDates>({
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  });

  const creditChartRef = useRef(null);
  const debitChartRef = useRef(null);

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadTotal() {
      if (hasPermission('creditos_compensados')) {
        setCreditTotalIsLoading(true);

        if (!selectedCredit) {
          return;
        }

        if (!creditRangeDates.startDate || !creditRangeDates.endDate) {
          return;
        }

        if (creditRangeDates.endDate < creditRangeDates.startDate) {
          return;
        }

        const startDateParsed = format(creditRangeDates.startDate, 'dd-MM-yyyy');
        const endDateParsed = format(creditRangeDates.endDate, 'dd-MM-yyyy');

        const creditTotalData = await PlanoContaService
          .findPlanoContasTotal(
            String(selectedCredit),
            startDateParsed,
            endDateParsed,
            safraId !== '_' ? safraId : undefined
          );

        setCreditLabels(creditTotalData.map((item) => item.descricao));
        setCreditTotal(creditTotalData.map((item) => item.total));
      }
      setCreditTotalIsLoading(false);
    }

    loadTotal();
  }, [hasPermission, selectedCredit, creditRangeDates, safraId]);

  useEffect(() => {
    async function loadTotal() {
      if (hasPermission('debitos_compensados')) {
        setDebitTotalIsLoading(true);

        if (!selectedDebit) {
          return;
        }

        if (!debitRangeDates.startDate || !debitRangeDates.endDate) {
          return;
        }

        if (debitRangeDates.endDate < debitRangeDates.startDate) {
          return;
        }

        const startDateParsed = format(debitRangeDates.startDate, 'dd-MM-yyyy');
        const endDateParsed = format(debitRangeDates.endDate, 'dd-MM-yyyy');

        const debitTotalData = await PlanoContaService
          .findPlanoContasTotal(
            String(selectedDebit),
            startDateParsed,
            endDateParsed,
            safraId !== '_' ? safraId : undefined
          );

        setDebitLabels(debitTotalData.map((item) => item.descricao));
        setDebitTotal(debitTotalData.map((item) => item.total));
      }
      setDebitTotalIsLoading(false);
    }

    loadTotal();
  }, [hasPermission, selectedDebit, debitRangeDates, safraId]);

  function handleSaveChart(type: 'credit' | 'debit') {
    const chartElement = type === 'credit' ? creditChartRef.current : debitChartRef.current;
    const fileName = type === 'credit'
      ? `CRÉDITOS COMPENSADOS ${format(creditRangeDates.startDate, 'dd-MM-yyyy')} À ${format(creditRangeDates.endDate, 'dd-MM-yyyy')}`
      : `DÉBITOS COMPENSADOS ${format(debitRangeDates.startDate, 'dd-MM-yyyy')} À ${format(debitRangeDates.endDate, 'dd-MM-yyyy')}`;

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
      a.download = fileName;
      a.click();
    });
  }

  return (
    <Container>
      <Content>
        <header>
          <h3>DÉBITOS COMPENSADOS</h3>
          <div>
            <DateInput
              onChangeDate={(date) => setDebitRangeDates((prevState) => ({
                ...prevState,
                startDate: date
              }))}
              placeholder='Data Inicial'
              defaultDate={subMonths(new Date(), 12)}
            />
            <strong>à</strong>
            <DateInput
              onChangeDate={(date) => setDebitRangeDates((prevState) => ({
                ...prevState,
                endDate: date
              }))}
              placeholder='Data Final'
              defaultDate={new Date()}
            />
          </div>
        </header>
        <div className="card" ref={debitChartRef}>
          {!hasPermission('debitos_compensados') && <NotAllowed />}
          {debitTotalIsLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          {hasPermission('debitos_compensados') && (
            <ChartAccountsSelect
              type='debit'
              selected={selectedDebit}
              setSelected={setSelectedDebit}
              isSecondary
            />
          )}
          <ChartAccountsChart
            labels={debitLabels}
            data={debitTotal}
          />
          {debitTotal.length > 0 && (
            <footer data-html2canvas-ignore>
              <Link
                to={`movimento-contas/analitica?type=debit&codigo=${(selectedDebit)
                }&startDate=${format(debitRangeDates.startDate, 'dd-MM-yyyy')
                }&endDate=${format(debitRangeDates.endDate, 'dd-MM-yyyy')
                }&safraId=${safraId}`}
              >
                Visão Detalhada
              </Link>
              <button onClick={() => handleSaveChart('debit')}>
                <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
              </button>
            </footer>
          )}
        </div>
      </Content>
      <Content>
        <header>
          <h3>CRÉDITOS COMPENSADOS</h3>
          <div>
            <DateInput
              onChangeDate={(date) => setCreditRangeDates((prevState) => ({
                ...prevState,
                startDate: date
              }))}
              placeholder='Data Inicial'
              defaultDate={subMonths(new Date(), 12)}
            />
            <strong>à</strong>
            <DateInput
              onChangeDate={(date) => setCreditRangeDates((prevState) => ({
                ...prevState,
                endDate: date
              }))}
              placeholder='Data Final'
              defaultDate={new Date()}
            />
          </div>
        </header>
        <div className="card" ref={creditChartRef}>
          {!hasPermission('creditos_compensados') && <NotAllowed />}
          {creditTotalIsLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          {hasPermission('creditos_compensados') && (
            <ChartAccountsSelect
              type='credit'
              selected={selectedCredit}
              setSelected={setSelectedCredit}
              isSecondary
            />
          )}
          <ChartAccountsChart
            labels={creditLabels}
            data={creditTotal}
          />
          {creditTotal.length > 0 && (
            <footer data-html2canvas-ignore>
              <Link
                to={`movimento-contas/analitica?type=credit&codigo=${(selectedCredit)
                }&startDate=${format(creditRangeDates.startDate, 'dd-MM-yyyy')
                }&endDate=${format(creditRangeDates.endDate, 'dd-MM-yyyy')
                }&safraId=${safraId}`}
              >
                Visão Detalhada
              </Link>
              <button onClick={() => handleSaveChart('credit')}>
                <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
              </button>
            </footer>
          )}
        </div>
      </Content>
    </Container>
  );
}
