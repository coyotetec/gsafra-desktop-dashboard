import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
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
import { MagnifyingGlass } from 'phosphor-react';
import { toast } from '../../utils/toast';

export function BeanStock() {
  const [canSubmit, setCanSubmit] = useState(true);
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

  const loadData = useCallback(() => {
    totalizersRef.current.loadData();
    producerScaleRef.current.loadData();
  }, []);

  useEffect(() => {
    async function loadCrops() {
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

        setTimeout(() => {
          loadData();
        }, 300);
      }
    }

    loadCrops();
  }, [cropsList.lastFetch, dispatch, loadData]);

  useEffect(() => {
    async function loadProducers() {
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
    }

    loadProducers();
  }, [dispatch, producersList.lastFetch]);

  useEffect(() => {
    async function loadStorages() {
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
    }

    loadStorages();
  }, [dispatch, storagesList.lastFetch]);

  useEffect(() => {
    async function loadSafras() {
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
    }

    loadSafras();
  }, [dispatch, safrasList.lastFetch]);

  return (
    <Container>
      <Header title="Estoque de Grãos" />
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) {
            loadData();
          }
        }}
      >
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
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => {
              if (
                date &&
                filters.rangeDates.endDate &&
                date > filters.rangeDates.endDate
              ) {
                toast({
                  type: 'danger',
                  text: 'Data final precisa ser maior que inicial!',
                });
                setCanSubmit(false);
                return;
              }
              setCanSubmit(true);
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
              if (
                date &&
                filters.rangeDates.startDate &&
                date < filters.rangeDates.startDate
              ) {
                toast({
                  type: 'danger',
                  text: 'Data final precisa ser maior que inicial!',
                });
                setCanSubmit(false);
                return;
              }
              setCanSubmit(true);
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
        <button type="submit">
          <MagnifyingGlass size={20} color="#CFD4D6" weight="bold" />
          Pesquisar
        </button>
      </form>
      <Totalizers ref={totalizersRef} />
      <ProducerScale ref={producerScaleRef} />
    </Container>
  );
}
