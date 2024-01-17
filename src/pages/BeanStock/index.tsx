import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';
import {
  change,
  setFirstCrop,
} from '../../redux/features/beanStockFiltersSlice';
import { setCropsData } from '../../redux/features/cropsListSlice';
import { setProducersData } from '../../redux/features/producersListSlice';
import { setSafrasData } from '../../redux/features/safrasListSlice';
import { setStoragesData } from '../../redux/features/storagesListSlice';
import { RootState } from '../../redux/store';
import AgriLocalService from '../../services/AgriLocalService';
import CulturaService from '../../services/CulturaService';
import PessoaService from '../../services/PessoaService';
import SafraService from '../../services/SafraService';
import { componentsRefType } from '../../types/Types';
import { hasToFetch } from '../../utils/hasToFetch';
import { ProducerScale } from './components/ProducerScale';
import { Totalizers } from './components/Totalizers';
import { Container } from './styles';

export function BeanStock() {
  const [isLoading, setIsLoading] = useState(true);
  const totalizersRef = useRef<componentsRefType>({
    loadData: () => null,
  });
  const producerScaleRef = useRef<componentsRefType>({
    loadData: () => null,
  });

  const {
    beanStockFilters: filters,
    cropsList,
    producersList,
    storagesList,
    safrasList,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const refreshData = useCallback(() => {
    totalizersRef.current.loadData();
    producerScaleRef.current.loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (hasToFetch(cropsList.lastFetch)) {
        const cropsData = await CulturaService.findCulturas();
        dispatch(
          setCropsData(
            cropsData.map((item) => ({
              value: String(item.id),
              label: item.nome,
            })),
          ),
        );

        dispatch(
          setFirstCrop(
            String(
              cropsData.find((item) =>
                item.nome.toUpperCase().startsWith('SOJA'),
              )?.id || cropsData[0].id,
            ),
          ),
        );
      }

      if (hasToFetch(producersList.lastFetch)) {
        const producersData = await PessoaService.findProdutores();
        dispatch(
          setProducersData([
            {
              value: '_',
              label: 'Todos',
            },
            ...producersData.map((item) => ({
              value: String(item.id),
              label: item.nome,
            })),
          ]),
        );
      }

      if (hasToFetch(storagesList.lastFetch)) {
        const storagesData = await AgriLocalService.findLocaisArmazenamento();
        dispatch(
          setStoragesData([
            {
              value: '_',
              label: 'Todos',
            },
            ...storagesData.map((item) => ({
              value: String(item.id),
              label: item.nome,
            })),
          ]),
        );
      }

      if (hasToFetch(safrasList.lastFetch)) {
        const safrasData = await SafraService.findSafras();
        dispatch(
          setSafrasData(
            safrasData.map((item) => ({
              value: String(item.id),
              label: item.nome,
            })),
          ),
        );
      }

      setIsLoading(false);
    }

    loadData();
  }, [
    dispatch,
    cropsList.lastFetch,
    producersList.lastFetch,
    storagesList.lastFetch,
    safrasList.lastFetch,
  ]);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header title="Estoque de Grãos" refreshData={refreshData} />
      <div className="filters">
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => {
              dispatch(
                change({
                  name: 'rangeDates',
                  value: {
                    startDate: date,
                    endDate: filters.rangeDates.endDate,
                  },
                }),
              );
            }}
            placeholder="Data Inicial"
            defaultDate={filters.rangeDates.startDate}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Inicial"
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => {
              dispatch(
                change({
                  name: 'rangeDates',
                  value: {
                    startDate: filters.rangeDates.startDate,
                    endDate: date,
                  },
                }),
              );
            }}
            placeholder="Data Final"
            defaultDate={filters.rangeDates.endDate}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Final"
          />
        </div>
        <Select
          options={cropsList.options}
          placeholder="Cultura"
          noOptionsMessage="0 culturas encontradas"
          value={filters.crop}
          onChange={(value: string) => {
            dispatch(change({ name: 'crop', value }));
          }}
          label="Cultura"
          width="100%"
        />
        <Select
          options={producersList.options}
          placeholder="Produtor"
          noOptionsMessage="0 produtores encontradas"
          value={filters.producer}
          onChange={(value: string) => {
            dispatch(change({ name: 'producer', value }));
          }}
          label="Produtor"
          width="100%"
        />
        <Select
          options={storagesList.options}
          placeholder="Local de Armazenamento"
          noOptionsMessage="0 locais de armazenamento encontradas"
          value={filters.safra}
          onChange={(value: string) => {
            dispatch(change({ name: 'storage', value }));
          }}
          label="Local de Armazenamento"
          width="100%"
        />
        <Select
          options={[
            {
              value: '_',
              label: 'Todos',
            },
            ...safrasList.options,
          ]}
          placeholder="Safra"
          noOptionsMessage="0 safras encontradas"
          value={filters.safra}
          onChange={(value: string) => {
            dispatch(change({ name: 'safra', value }));
          }}
          label="Safra"
          width="100%"
        />
      </div>
      <Totalizers ref={totalizersRef} />
      <ProducerScale ref={producerScaleRef} />
    </Container>
  );
}
