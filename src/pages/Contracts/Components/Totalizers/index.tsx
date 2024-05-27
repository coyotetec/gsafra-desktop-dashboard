import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import { Container, Loader } from './styles';
import emptyIllustration from '../../../../assets/images/empty.svg';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Spinner } from '../../../../components/Spinner';
import { useUserContext } from '../../../../contexts/UserContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { formatDate } from '../../../../utils/formatDate';

interface TotalizersProps {
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 4;

export function Totalizers({ isLoading }: TotalizersProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const { hasPermission } = useUserContext();

  const {
    contractData: { contracts },
  } = useSelector((state: RootState) => state);

  const contractsToShow = useMemo(
    () =>
      contracts.slice(
        currentPage * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      ),
    [contracts, currentPage],
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [contracts]);

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id', {
      maximumFractionDigits: 2,
    }).format(number)}${sufix || ''}`;
  }

  return (
    <Container>
      {!hasPermission('contratos') && <NotAllowed />}
      {isLoading && (
        <Loader>
          <Spinner size={48} />
        </Loader>
      )}
      {contracts.length === 0 ? (
        <div className="empty">
          <img src={emptyIllustration} alt="Ilustração de vazio" />
          <strong>Nenhum dado encontrado</strong>
          <span>Tente selecionar outra safra.</span>
        </div>
      ) : (
        contractsToShow.map((contract) => (
          <div key={contract.id} className="total-contract">
            <div>
              <span>{`${contract.cliente} - ${contract.numeroContrato}`}</span>
              <strong className="value">
                {currencyFormat(contract.valorContrato)}
              </strong>
              <span className="contract-info">
                <strong>Preço/Saca: </strong>
                {currencyFormat(contract.valorSaca)}
              </span>
              <span>
                <strong>Vencimento: </strong>
                {formatDate(contract.dataVencimento)}
              </span>
            </div>
            <div className="contract-progress">
              <div className="progressbar">
                <div
                  className="bar"
                  style={{
                    width:
                      contract.porcentagem > 100
                        ? `${100 - ((contract.porcentagem - 100) * 100) / contract.porcentagem}%`
                        : `${contract.porcentagem}%`,
                  }}
                ></div>
                {contract.porcentagem > 100 && (
                  <div
                    className="overbar"
                    style={{
                      width: `${((contract.porcentagem - 100) * 100) / contract.porcentagem}%`,
                    }}
                  ></div>
                )}
                <strong>{formatNumber(contract.porcentagem, '%')}</strong>
              </div>
              <div className="info">
                <span>
                  <strong>Entregue: </strong>
                  {formatNumber(contract.totalEntregue, ' Kg')} /{' '}
                  {formatNumber(contract.totalEntregue / 60, ' Sacas')}
                </span>
                <span>
                  <strong>Saldo: </strong>
                  {formatNumber(
                    contract.totalContrato - contract.totalEntregue,
                    ' Kg',
                  )}{' '}
                  /{' '}
                  {formatNumber(
                    (contract.totalContrato - contract.totalEntregue) / 60,
                    ' Sacas',
                  )}
                </span>
              </div>
            </div>
            <div className="contract-value">
              <strong>{formatNumber(contract.totalContrato, ' Kg')}</strong>
              <strong>
                {formatNumber(contract.totalContrato / 60, ' Sacas')}
              </strong>
            </div>
          </div>
        ))
      )}
      {contracts.length > ITEMS_PER_PAGE && (
        <footer>
          {currentPage > 0 && (
            <button
              aria-label="página anterior"
              onClick={() => setCurrentPage((prevState) => prevState - 1)}
            >
              <ArrowLeft size={20} color="#F7FBFE" weight="regular" />
            </button>
          )}

          {currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE < contracts.length && (
            <button
              aria-label="próxima página"
              onClick={() => setCurrentPage((prevState) => prevState + 1)}
            >
              <ArrowRight size={20} color="#F7FBFE" weight="regular" />
            </button>
          )}
        </footer>
      )}
    </Container>
  );
}
