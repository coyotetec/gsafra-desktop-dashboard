import React, { useContext, useEffect, useState } from 'react';
import {
  ArrowCircleDown,
  ArrowCircleRight,
  ArrowCircleUp,
  CreditCard,
  X,
} from 'phosphor-react';
import { CardsList, Container, Detail, DetailTitle } from './styles';

import { CreditCardTotal } from '../../../../types/CreditCard';
import { Total } from '../../../../types/Financial';

import { sumTotal } from '../../utils/sumTotal';
import { currencyFormat } from '../../../../utils/currencyFormat';
import CheckService from '../../../../services/CheckService';
import CreditCardService from '../../../../services/CreditCardService';
import FinancialService from '../../../../services/FinancialService';
import useAnimatedUnmount from '../../../../hooks/useAnimatedUnmount';
import { NotAllowed } from '../../../../components/NotAllowed';
import { UserContext } from '../../../../components/App';
import { addMonths, format } from 'date-fns';
import { DateInput } from '../../../../components/DateInput';

interface TotalizerProps {
  safraId?: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Totalizer({ safraId, setIsLoading }: TotalizerProps) {
  const [payableTotal, setPayableTotal] = useState<Total>();
  const [receivableTotal, setReceivableTotal] = useState<Total>();
  const [payableCheckTotal, setPayableCheckTotal] = useState<Total>();
  const [receivableCheckTotal, setReceivableCheckTotal] = useState<Total>();
  const [sumPayableTotal, setSumPayableTotal] = useState<Total>();
  const [sumReceivableTotal, setSumReceivableTotal] = useState<Total>();
  const [creditCardTotal, setCreditCardTotal] = useState<CreditCardTotal>();
  const [showPayableDetails, setShowPayableDetails] = useState(false);
  const [showReceivableDetails, setShowReceivableDetails] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(addMonths(new Date(), 6));

  const { hasPermission } = useContext(UserContext);

  const {
    shouldRender: shouldPayableRender,
    animatedElementRef: animatedPayableRef
  } = useAnimatedUnmount(showPayableDetails);

  const {
    shouldRender: shouldReceivableRender,
    animatedElementRef: animatedReceivableRef
  } = useAnimatedUnmount(showReceivableDetails);

  useEffect(() => {
    async function loadTotal() {
      setIsLoading(true);
      const startDateParsed = startDate ? format(startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = endDate ? format(endDate, 'dd-MM-yyyy') : '';

      if (hasPermission('resumo_pendentes_pagamento')) {
        const payableTotalData = await FinancialService
          .findPayableTotal(
            startDateParsed,
            endDateParsed,
            safraId !== '_' ? safraId : undefined
          );
        const payableCheckTotalData = await CheckService
          .findPayableCheckTotal(
            startDateParsed,
            endDateParsed,
            safraId !== '_' ? safraId : undefined
          );
        const sumPayableTotalData = sumTotal(
          [payableTotalData, payableCheckTotalData]
        );

        setSumPayableTotal(sumPayableTotalData);
        setPayableTotal(payableTotalData);
        setPayableCheckTotal(payableCheckTotalData);
      }

      if (hasPermission('resumo_pendentes_recebimento')) {
        const receivableTotalData = await FinancialService
          .findReceivableTotal(
            startDateParsed,
            endDateParsed,
            safraId !== '_' ? safraId : undefined
          );
        const receivableCheckTotalData = await CheckService
          .findReceivableCheckTotal(
            startDateParsed,
            endDateParsed,
            safraId !== '_' ? safraId : undefined
          );
        const sumReceivableTotalData = sumTotal(
          [receivableTotalData, receivableCheckTotalData]
        );

        setSumReceivableTotal(sumReceivableTotalData);
        setReceivableTotal(receivableTotalData);
        setReceivableCheckTotal(receivableCheckTotalData);
      }

      if (hasPermission('resumo_cartao_credito')) {
        const creditCardTotalData = await CreditCardService
          .findTotal(
            startDateParsed,
            endDateParsed,
            safraId !== '_' ? safraId : undefined
          );

        setCreditCardTotal(creditCardTotalData);
      }

      setIsLoading(false);
    }

    loadTotal();
  }, [hasPermission, startDate, endDate, safraId, setIsLoading]);

  return (
    <Container>
      <header>
        <h3>RESUMO</h3>
        <div>
          <DateInput
            onChangeDate={(date) => setStartDate(date)}
            placeholder='Data Inicial'
            defaultDate={new Date()}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => setEndDate(date)}
            placeholder='Data Final'
            defaultDate={addMonths(new Date(), 6)}
          />
        </div>
      </header>

      <CardsList>
        <div className="card">
          {!hasPermission('resumo_pendentes_pagamento') && <NotAllowed />}
          <strong>
            <ArrowCircleUp size={24} color="#00D47E" weight="duotone" />
            Pendentes de Pagamento
          </strong>
          <span>
            {currencyFormat(sumPayableTotal?.total || 0)}
            <button
              type="button"
              onClick={() => setShowPayableDetails((prevState) => !prevState)}
            >
              <ArrowCircleRight size={24} color="#F7FBFE" weight='fill' />
            </button>
          </span>
          <small>{sumPayableTotal?.quantity} itens</small>
          <footer>
            <span>Próximos 7 dias:
              <small>
                {currencyFormat(sumPayableTotal?.totalNextSeven.total || 0)}
              </small>
            </span>
            <span>Próximos 15 dias:
              <small>
                {currencyFormat(sumPayableTotal?.totalNextSeven.total || 0)}
              </small>
            </span>
          </footer>
        </div>

        <div className="card">
          {!hasPermission('resumo_pendentes_recebimento') && <NotAllowed />}
          <strong>
            <ArrowCircleDown size={24} color="#00D47E" weight="duotone" />
            Pendentes de Recebimento
          </strong>
          <span>
            {currencyFormat(sumReceivableTotal?.total || 0)}
            <button
              type="button"
              onClick={() => setShowReceivableDetails((prevState) => !prevState)}
            >
              <ArrowCircleRight size={24} color="#F7FBFE" weight='fill' />
            </button>
          </span>
          <small>{sumReceivableTotal?.quantity} itens</small>
          <footer>
            <span>Próximos 7 dias:
              <small>
                {currencyFormat(sumReceivableTotal?.totalNextSeven.total || 0)}
              </small>
            </span>
            <span>Próximos 15 dias:
              <small>
                {currencyFormat(sumReceivableTotal?.totalNextSeven.total || 0)}
              </small>
            </span>
          </footer>
        </div>

        <div className="card">
          {!hasPermission('resumo_cartao_credito') && <NotAllowed />}
          <strong>
            <CreditCard size={24} color="#00D47E" weight="duotone" />
            Fatura do Cartão de Crédito
          </strong>
          <span>
            {currencyFormat(creditCardTotal?.total || 0)}
          </span>
          <small>{creditCardTotal?.quantity} itens</small>
          <footer>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{
                  width: `${(creditCardTotal?.usagePercentage || 0) > 100
                    ? 100
                    : creditCardTotal?.usagePercentage
                  }%`
                }}
              ></div>
            </div>
            <span>
              Limite restante:
              <small>{currencyFormat(creditCardTotal?.availableLimit || 0)}</small>
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
                {currencyFormat(payableTotal?.total || 0)}
              </span>
              <small>({payableTotal?.quantity} itens)</small>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(payableTotal?.totalNextSeven.total || 0)}
                  </small>
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(payableTotal?.totalNextSeven.total || 0)}
                  </small>
                </li>
              </ul>
            </section>

            <div className="separator"></div>

            <section>
              <strong>Cheques a Pagar</strong>
              <span>
                {currencyFormat(payableCheckTotal?.total || 0)}
              </span>
              <small>({payableCheckTotal?.quantity} itens)</small>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(payableCheckTotal?.totalNextSeven.total || 0)}
                  </small>
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(payableCheckTotal?.totalNextSeven.total || 0)}
                  </small>
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
                {currencyFormat(receivableTotal?.total || 0)}
              </span>
              <small>({receivableTotal?.quantity} itens)</small>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(receivableTotal?.totalNextSeven.total || 0)}
                  </small>
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(receivableTotal?.totalNextSeven.total || 0)}
                  </small>
                </li>
              </ul>
            </section>

            <div className="separator"></div>

            <section>
              <strong>Cheques a Receber</strong>
              <span>
                {currencyFormat(receivableCheckTotal?.total || 0)}
              </span>
              <small>({receivableCheckTotal?.quantity} itens)</small>
              <ul>
                <li>
                  Próximos 7 dias:
                  <small>
                    {currencyFormat(receivableCheckTotal?.totalNextSeven.total || 0)}
                  </small>
                </li>
                <li>
                  Próximos 15 dias:
                  <small>
                    {currencyFormat(receivableCheckTotal?.totalNextSeven.total || 0)}
                  </small>
                </li>
              </ul>
            </section>
          </Detail>
        </>
      )}
    </Container>
  );
}
