import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Spinner } from '../../../../components/Spinner';
import ColheitaService, {
  descontoType,
} from '../../../../services/ColheitaService';
import { Container, Loader } from './styles';
import { Switch } from '../../../../components/Switch';
import { Select } from '../../../../components/Select';
import { DiscountChart } from '../DiscountChart';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/productionFiltersSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { setData } from '../../../../redux/features/productionDataSlice';
import { componentsRefType } from '../../../../types/Types';

type optionType = {
  value: descontoType;
  label: string;
}[];

export const Discount = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const discountOptions: optionType = [
    { value: 'umidade', label: 'Umidade' },
    { value: 'impureza', label: 'Impureza' },
    { value: 'avariados', label: 'Avariados' },
    { value: 'quebrados', label: 'Quebrados' },
    { value: 'esverdeados', label: 'Esverdeados' },
    { value: 'taxa_recepcao', label: 'Taxa de Recepção' },
    { value: 'cota', label: 'Cota' },
  ];
  const isFirstRender = useRef(true);

  const {
    productionFilters: {
      discountsUnit: unit,
      discount: selectedDiscount,
      safra,
    },
    productionData: { discount },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('descontos_producao')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(discount.lastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (safra === '_') {
        setIsLoading(false);
        return;
      }

      const discountTotalData = await ColheitaService.findDescontoTotal(
        safra,
        selectedDiscount as descontoType,
      );

      dispatch(
        setData({
          name: 'discount',
          data: discountTotalData,
        }),
      );
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, hasPermission, safra, selectedDiscount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useImperativeHandle(
    ref,
    () => ({
      loadData,
    }),
    [loadData],
  );

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id').format(number)}${sufix || ''}`;
  }

  return (
    <Container>
      <header>
        <h3>DESCONTOS</h3>
        <Select
          options={discountOptions}
          value={selectedDiscount}
          onChange={(value: string) =>
            dispatch(
              change({
                name: 'discount',
                value,
              }),
            )
          }
          width="240px"
          height="40px"
        />
      </header>
      <div className="card">
        {!hasPermission('descontos_producao') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div className="total">
            <span>
              <strong>Desconto Total em Kg: </strong>
              {formatNumber(discount.totalDescontoRealSafra, ' Kg')}
            </span>
            <span>
              <strong>
                Média{' '}
                {
                  discountOptions.find((i) => i.value === selectedDiscount)
                    ?.label
                }
                :{' '}
              </strong>
              {formatNumber(discount.porcentagemDescontoSafra, '%')}
            </span>
          </div>
          <Switch
            leftLabel="%"
            rightLabel="Kg"
            isToggled={unit === 'kg'}
            onToggle={(e) =>
              dispatch(
                change({
                  name: 'discountsUnit',
                  value: e.target.checked ? 'kg' : 'sacks',
                }),
              )
            }
          />
        </header>
        <DiscountChart
          labels={discount.talhoesDescontoTotal.map((i) => i.talhao)}
          data={discount.talhoesDescontoTotal.map((i) =>
            unit === 'percent' ? i.descontoPorcentagem : i.descontoReal,
          )}
          unit={unit}
        />
      </div>
    </Container>
  );
});

Discount.displayName = 'Discount';
