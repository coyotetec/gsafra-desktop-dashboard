import { useEffect, useState } from 'react';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';
import AgriLocalService from '../../services/AgriLocalService';
import CulturaService from '../../services/CulturaService';
import PessoaService from '../../services/PessoaService';
import SafraService from '../../services/SafraService';
import { ProducerScale } from './components/ProducerScale';
import { Totalizers } from './components/Totalizers';
import { Container } from './styles';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

type optionType = {
  value: string;
  label: string;
}[];

export function BeanStock() {
  const [isLoading, setIsLoading] = useState(true);
  const [cropOptions, setCropOptions] = useState<optionType>([]);
  const [selectedCrop, setSelectedCrop] = useState('_');
  const [producerOptions, setProducerOptions] = useState<optionType>([]);
  const [selectedProducer, setSelectedProducer] = useState('_');
  const [storageOptions, setStorageOptions] = useState<optionType>([]);
  const [selectedStorage, setSelectedStorage] = useState('_');
  const [safraOptions, setSafraOptions] = useState<optionType>([]);
  const [selectedSafra, setSelectedSafra] = useState('_');
  const [rangeDates, setRangeDates] = useState<RangeDates>({
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    async function loadData() {
      const [
        cropsData,
        producersData,
        storagesData,
        safrasData
      ] = await Promise.all([
        CulturaService.findCulturas(),
        PessoaService.findProdutores(),
        AgriLocalService.findLocaisArmazenamento(),
        SafraService.findSafras()
      ]);

      setCropOptions(cropsData.map((item) => ({
        value: String(item.id),
        label: item.nome
      })));
      setSelectedCrop(String(
        cropsData.find((item) => item.nome.toUpperCase().startsWith('SOJA'))?.id || cropsData[0].id
      ));
      setProducerOptions([{
        value: '_',
        label: 'Todos',
      }, ...producersData.map((item) => ({
        value: String(item.id),
        label: item.nome
      }))]);
      setStorageOptions([{
        value: '_',
        label: 'Todos',
      }, ...storagesData.map((item) => ({
        value: String(item.id),
        label: item.nome
      }))]);
      setSafraOptions([{
        value: '_',
        label: 'Todas',
      }, ...safrasData.map((item) => ({
        value: String(item.id),
        label: item.nome
      }))]);

      setIsLoading(false);
    }

    loadData();
  }, []);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header title="Estoque de Grãos" />
      <div className="filters">
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => setRangeDates((prevState) => ({
              ...prevState,
              startDate: date
            }))}
            placeholder='Data Inicial'
            defaultDate={null}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Inicial"
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => setRangeDates((prevState) => ({
              ...prevState,
              endDate: date
            }))}
            placeholder='Data Final'
            defaultDate={null}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Final"
          />
        </div>
        <Select
          options={cropOptions}
          placeholder="Cultura"
          noOptionsMessage="0 culturas encontradas"
          value={selectedCrop}
          onChange={setSelectedCrop}
          label="Cultura"
          width="100%"
        />
        <Select
          options={producerOptions}
          placeholder="Produtor"
          noOptionsMessage="0 produtores encontradas"
          value={selectedProducer}
          onChange={setSelectedProducer}
          label="Produtor"
          width="100%"
        />
        <Select
          options={storageOptions}
          placeholder="Local de Armazenamento"
          noOptionsMessage="0 locais de armazenamento encontradas"
          value={selectedStorage}
          onChange={setSelectedStorage}
          label="Local de Armazenamento"
          width="100%"
        />
        <Select
          options={safraOptions}
          placeholder="Safra"
          noOptionsMessage="0 safras encontradas"
          value={selectedSafra}
          onChange={setSelectedSafra}
          label="Safra"
          width="100%"
        />
      </div>
      <Totalizers
        cropId={selectedCrop}
        rangeDates={rangeDates}
        producerId={selectedProducer}
        storageId={selectedStorage}
        safraId={selectedSafra}
      />
      <ProducerScale
        cropId={selectedCrop}
        rangeDates={rangeDates}
        producerId={selectedProducer}
        storageId={selectedStorage}
        safraId={selectedSafra}
      />
    </Container>
  );
}
