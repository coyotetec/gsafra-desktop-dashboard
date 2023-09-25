import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  ArrowCircleDown,
  ArrowCircleRight,
  ArrowCircleUp,
  ArrowSquareOut,
  CreditCard,
  X,
} from 'phosphor-react';
import { CardsList, Container, Detail, DetailTitle, Loader } from './styles';
import { Total } from '../../../../types/Financial';
import { sumTotal } from '../../utils/sumTotal';
import { currencyFormat } from '../../../../utils/currencyFormat';
import CheckService from '../../../../services/CheckService';
import CreditCardService from '../../../../services/CreditCardService';
import FinancialService from '../../../../services/FinancialService';
import useAnimatedUnmount from '../../../../hooks/useAnimatedUnmount';
import { NotAllowed } from '../../../../components/NotAllowed';
import { addDays, format } from 'date-fns';
import { DateInput } from '../../../../components/DateInput';
import { useSearchParams } from 'react-router-dom';
import { toast } from '../../../../utils/toast';
import { Spinner } from '../../../../components/Spinner';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/financialFiltersSlice';
import { change as totalizersChange } from '../../../../redux/features/financialTotalizersDataSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { componentsRefType } from '../../../../types/Types';

interface DetailsModalArgs {
  type: 'CP' | 'CR' | 'CHP' | 'CHR' | 'CA';
  period: 0 | 7 | 15;
}

export const Totalizer = forwardRef<componentsRefType>((props, ref) => {
  const [showPayableDetails, setShowPayableDetails] = useState(false);
  const [showReceivableDetails, setShowReceivableDetails] = useState(false);
  const [isPayableLoading, setIsPayableLoading] = useState(true);
  const [isReceivableLoading, setIsReceivableLoading] = useState(true);
  const [isCreditCardLoading, setIsCreditCardLoading] = useState(true);
  const isFirstPayableRender = useRef(true);
  const isFirstReceivableRender = useRef(true);
  const isFirstCreditCardRender = useRef(true);

  const {
    financialFilters: {
      totalizerRangeDates: { startDate, endDate },
      status,
      lastSelectedSafras: safras,
    },
    financialTotalizersData: {
      payableTotalizer,
      receivableTotalizer,
      creditCardTotalizer,
    },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const zeroTotal = useMemo<Total>(() => ({
    quantity: 0,
    total: 0,
    totalNextSeven: {
      quantity: 0,
      total: 0,
    },
    totalNextFifteen: {
      quantity: 0,
      total: 0
    }
  }), []);

  const { hasPermission } = useUserContext();
  const [, setQuery] = useSearchParams();

  const {
    shouldRender: shouldPayableRender,
    animatedElementRef: animatedPayableRef
  } = useAnimatedUnmount(showPayableDetails);

  const {
    shouldRender: shouldReceivableRender,
    animatedElementRef: animatedReceivableRef
  } = useAnimatedUnmount(showReceivableDetails);

  const loadPayableTotal = useCallback(async () => {
    if (hasPermission('resumo_pendentes_pagamento')) {
      setIsPayableLoading(true);

      if (isFirstPayableRender.current) {
        isFirstPayableRender.current = false;

        if (!hasToFetch(payableTotalizer.lastFetch)) {
          setIsPayableLoading(false);
          return;
        }
      }

      if (endDate && startDate && endDate < startDate) {
        dispatch(totalizersChange({
          name: 'payableTotalizer',
          value: {
            accounts: zeroTotal,
            check: zeroTotal,
            total: zeroTotal,
          },
        }));
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const startDateParsed = startDate ? format(startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = endDate ? format(endDate, 'dd-MM-yyyy') : '';

      const [payableTotalData, payableCheckTotalData] = await Promise.all([
        FinancialService.findPayableTotal(
          startDateParsed,
          endDateParsed,
          safras.length > 0 ? safras.join(',') : undefined,
          status !== '_' ? status : undefined
        ),
        CheckService.findPayableCheckTotal(
          startDateParsed,
          endDateParsed,
          safras.length > 0 ? safras.join(',') : undefined,
        )
      ]);

      const sumPayableTotalData = sumTotal(
        [payableTotalData, payableCheckTotalData]
      );

      dispatch(totalizersChange({
        name: 'payableTotalizer',
        value: {
          accounts: payableTotalData,
          check: payableCheckTotalData,
          total: sumPayableTotalData,
        },
      }));
    }
    setIsPayableLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, endDate, hasPermission, safras, startDate, zeroTotal, status]);

  const loadReceivableTotal = useCallback(async () => {
    if (hasPermission('resumo_pendentes_recebimento')) {
      setIsReceivableLoading(true);

      if (isFirstReceivableRender.current) {
        isFirstReceivableRender.current = false;

        if (!hasToFetch(payableTotalizer.lastFetch)) {
          setIsReceivableLoading(false);
          return;
        }
      }

      if (endDate && startDate && endDate < startDate) {
        dispatch(totalizersChange({
          name: 'receivableTotalizer',
          value: {
            accounts: zeroTotal,
            check: zeroTotal,
            total: zeroTotal,
          },
        }));
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const startDateParsed = startDate ? format(startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = endDate ? format(endDate, 'dd-MM-yyyy') : '';

      const [receivableTotalData, receivableCheckTotalData] = await Promise.all([
        FinancialService.findReceivableTotal(
          startDateParsed,
          endDateParsed,
          safras.length > 0 ? safras.join(',') : undefined,
          status !== '_' ? status : undefined
        ),
        CheckService.findReceivableCheckTotal(
          startDateParsed,
          endDateParsed,
          safras.length > 0 ? safras.join(',') : undefined,
        )
      ]);
      const sumReceivableTotalData = sumTotal(
        [receivableTotalData, receivableCheckTotalData]
      );

      dispatch(totalizersChange({
        name: 'receivableTotalizer',
        value: {
          accounts: receivableTotalData,
          check: receivableCheckTotalData,
          total: sumReceivableTotalData,
        },
      }));
    }
    setIsReceivableLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, endDate, hasPermission, safras, startDate, zeroTotal, status]);

  const loadCreditCardTotal = useCallback(async () => {
    if (hasPermission('resumo_cartao_credito')) {
      setIsCreditCardLoading(true);

      if (isFirstCreditCardRender.current) {
        isFirstCreditCardRender.current = false;

        if (!hasToFetch(payableTotalizer.lastFetch)) {
          setIsCreditCardLoading(false);
          return;
        }
      }

      if (endDate && startDate && endDate < startDate) {
        dispatch(totalizersChange({
          name: 'receivableTotalizer',
          value: {
            quantity: 0,
            total: 0,
            availableLimit: 0,
            totalLimit: 0,
            usagePercentage: 0,
          },
        }));
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const startDateParsed = startDate ? format(startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = endDate ? format(endDate, 'dd-MM-yyyy') : '';

      const creditCardTotalData = await CreditCardService.findTotal(
        startDateParsed,
        endDateParsed,
        safras.length > 0 ? safras.join(',') : undefined,
      );

      dispatch(totalizersChange({
        name: 'creditCardTotalizer',
        value: creditCardTotalData,
      }));
    }
    setIsCreditCardLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, endDate, hasPermission, safras, startDate]);

  const loadData = useCallback(() => {
    loadPayableTotal();
    loadReceivableTotal();
    loadCreditCardTotal();
  }, [loadCreditCardTotal, loadPayableTotal, loadReceivableTotal]);

  useImperativeHandle(ref, () => ({
    loadData
  }), [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleOpenDetailsModal({ type, period }: DetailsModalArgs) {
    if (period === 0) {
      setQuery((prevValue) => {
        prevValue.set('tela', type);
        prevValue.set('dataInicial', startDate ? format(startDate, 'dd-MM-yyyy') : '_');
        prevValue.set('dataFinal', endDate ? format(endDate, 'dd-MM-yyyy') : '_');

        return prevValue;
      });

      return;
    }

    if (startDate) {
      setQuery((prevValue) => {
        prevValue.set('tela', type);
        prevValue.set('dataInicial', format(startDate, 'dd-MM-yyyy'));
        prevValue.set('dataFinal', format(addDays(startDate, period), 'dd-MM-yyyy'));

        return prevValue;
      });
    }
  }

  return (
    <Container>
      <header>
        <h3>RESUMO</h3>
        <div>
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'totalizerRangeDates', value: {
                  startDate: date,
                  endDate
                }
              }));
            }}
            placeholder='Data Inicial'
            defaultDate={startDate}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'totalizerRangeDates', value: {
                  startDate,
                  endDate: date
                }
              }));
            }}
            placeholder='Data Final'
            defaultDate={endDate}
          />
        </div>
      </header>

      <CardsList>
        <div className="card">
          {!hasPermission('resumo_pendentes_pagamento') && <NotAllowed />}
          {isPayableLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          <strong>
            <ArrowCircleUp size={24} color="#00D47E" weight="duotone" />
            Pendentes de Pagamento
          </strong>
          <span>
            {currencyFormat(payableTotalizer.total.total)}
            <button
              type="button"
              onClick={() => setShowPayableDetails((prevState) => !prevState)}
            >
              <ArrowCircleRight size={24} color="#F7FBFE" weight='fill' />
            </button>
          </span>
          <small>{payableTotalizer.total.quantity} itens</small>
          <footer>
            <span>Próximos 7 dias:
              <small>
                {currencyFormat(payableTotalizer.total.totalNextSeven.total)}
              </small>
            </span>
            <span>Próximos 15 dias:
              <small>
                {currencyFormat(payableTotalizer.total.totalNextFifteen.total)}
              </small>
            </span>
          </footer>
        </div>

        <div className="card">
          {!hasPermission('resumo_pendentes_recebimento') && <NotAllowed />}
          {isReceivableLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          <strong>
            <ArrowCircleDown size={24} color="#00D47E" weight="duotone" />
            Pendentes de Recebimento
          </strong>
          <span>
            {currencyFormat(receivableTotalizer.total.total)}
            <button
              type="button"
              onClick={() => setShowReceivableDetails((prevState) => !prevState)}
            >
              <ArrowCircleRight size={24} color="#F7FBFE" weight='fill' />
            </button>
          </span>
          <small>{receivableTotalizer.total.quantity} itens</small>
          <footer>
            <span>Próximos 7 dias:
              <small>
                {currencyFormat(receivableTotalizer.total.totalNextSeven.total)}
              </small>
            </span>
            <span>Próximos 15 dias:
              <small>
                {currencyFormat(receivableTotalizer.total.totalNextFifteen.total)}
              </small>
            </span>
          </footer>
        </div>

        <div className="card">
          {!hasPermission('resumo_cartao_credito') && <NotAllowed />}
          {isCreditCardLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          <strong>
            <CreditCard size={24} color="#00D47E" weight="duotone" />
            Fatura do Cartão de Crédito
          </strong>
          <span>
            {currencyFormat(creditCardTotalizer.total)}
            <button
              type="button"
              className="modal-button"
              style={{
                transform: 'translateY(0)'
              }}
              onClick={() => handleOpenDetailsModal({
                type: 'CA',
                period: 0
              })}>
              <ArrowSquareOut size={24} color="#00D47E" weight="fill" />
            </button>
          </span>
          <small>{creditCardTotalizer.quantity} itens</small>
          <footer>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{
                  width: `${(creditCardTotalizer.usagePercentage) > 100
                    ? 100
                    : creditCardTotalizer.usagePercentage
                  }%`
                }}
              ></div>
            </div>
            <span>
              Limite restante:
              <small>{currencyFormat(creditCardTotalizer.availableLimit)}</small>
            </span>
          </footer>
        </div>
      </CardsList>

      {shouldPayableRender && (
        <>
          <DetailTitle isLeaving={!showPayableDetails}>
            DETALHES: PENDENTES DE PAGAMENTO
          </DetailTitle>
          <Detail ref={animatedPayableRef} isLeaving={!showPayableDetails}>
            <button
              className="close-button"
              onClick={() => setShowPayableDetails(false)}
            >
              <X size={24} color="#F7FBFE" />
            </button>
            <section>
              <strong>Contas a Pagar</strong>
              <span>
                {currencyFormat(payableTotalizer.accounts.total)}
              </span>
              <small>({payableTotalizer.accounts.quantity} itens)</small>
              <button
                type="button"
                className="modal-button"
                onClick={() => handleOpenDetailsModal({
                  type: 'CP',
                  period: 0
                })}>
                <ArrowSquareOut size={24} color="#00D47E" weight="fill" />
              </button>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(payableTotalizer.accounts.totalNextSeven.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CP',
                      period: 7
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(payableTotalizer.accounts.totalNextFifteen.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CP',
                      period: 15
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
              </ul>
            </section>

            <div className="separator"></div>

            <section>
              <strong>Cheques a Pagar</strong>
              <span>
                {currencyFormat(payableTotalizer.check.total)}
              </span>
              <small>({payableTotalizer.check.quantity} itens)</small>
              <button
                type="button"
                className="modal-button"
                onClick={() => handleOpenDetailsModal({
                  type: 'CHP',
                  period: 0
                })}>
                <ArrowSquareOut size={24} color="#00D47E" weight="fill" />
              </button>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(payableTotalizer.check.totalNextSeven.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CHP',
                      period: 7
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(payableTotalizer.check.totalNextFifteen.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CHP',
                      period: 15
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
              </ul>
            </section>
          </Detail>
        </>
      )}

      {shouldReceivableRender && (
        <>
          <DetailTitle isLeaving={!showReceivableDetails}>
            DETALHES: PENDENTES DE RECEBIMENTO
          </DetailTitle>
          <Detail ref={animatedReceivableRef} isLeaving={!showReceivableDetails}>
            <button
              className="close-button"
              onClick={() => setShowReceivableDetails(false)}
            >
              <X size={24} color="#F7FBFE" />
            </button>
            <section>
              <strong>Contas a Receber</strong>
              <span>
                {currencyFormat(receivableTotalizer.accounts.total)}
              </span>
              <small>({receivableTotalizer.accounts.quantity} itens)</small>
              <button
                type="button"
                className="modal-button"
                onClick={() => handleOpenDetailsModal({
                  type: 'CR',
                  period: 0
                })}>
                <ArrowSquareOut size={24} color="#00D47E" weight="fill" />
              </button>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(receivableTotalizer.accounts.totalNextSeven.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CR',
                      period: 7
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(receivableTotalizer.accounts.totalNextFifteen.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CR',
                      period: 15
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
              </ul>
            </section>

            <div className="separator"></div>

            <section>
              <strong>Cheques a Receber</strong>
              <span>
                {currencyFormat(receivableTotalizer.check.total)}
              </span>
              <small>({receivableTotalizer.check.quantity} itens)</small>
              <button
                type="button"
                className="modal-button"
                onClick={() => handleOpenDetailsModal({
                  type: 'CHR',
                  period: 0
                })}>
                <ArrowSquareOut size={24} color="#00D47E" weight="fill" />
              </button>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(receivableTotalizer.check.totalNextSeven.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CHR',
                      period: 7
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(receivableTotalizer.check.totalNextFifteen.total)}
                  </small>
                  {startDate && (<button
                    type="button"
                    className="modal-button"
                    onClick={() => handleOpenDetailsModal({
                      type: 'CHR',
                      period: 15
                    })}>
                    <ArrowSquareOut size={20} color="#00D47E" weight="fill" />
                  </button>)}
                </li>
              </ul>
            </section>
          </Detail>
        </>
      )}
    </Container>
  );
});
