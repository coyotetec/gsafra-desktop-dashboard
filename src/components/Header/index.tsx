import { useEffect, useState } from 'react';
import { Container } from './styles';

import { Select } from '../Select';

import SafraService from '../../services/SafraService';
import { ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import TalhaoService from '../../services/TalhaoService';

interface HeaderProps {
  title: string;
  subtitle?: string;
  hasSafraFilter?: boolean;
  setChangeSafra?: React.Dispatch<React.SetStateAction<string>>;
  selectedSafra?: string;
  canGoBack?: boolean;
  allSafras?: boolean;
  hasTalhaoFilter?: boolean;
  setChangeTalhao?: React.Dispatch<React.SetStateAction<string>>;
  selectedTalhao?: string;
}

type optionType = {
  value: string;
  label: string;
}[]

export function Header({
  title,
  subtitle,
  hasSafraFilter = false,
  setChangeSafra,
  selectedSafra,
  hasTalhaoFilter = false,
  setChangeTalhao,
  selectedTalhao,
  canGoBack = false,
  allSafras = true,
}: HeaderProps) {
  const [safrasOptions, setSafrasOptions] = useState<optionType>([]);
  const [talhoesOptions, setTalhoesOptions] = useState<optionType>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSafras() {
      if (hasSafraFilter && setChangeSafra) {
        const safrasData = await SafraService.findSafras();

        const options: optionType = safrasData.map((safra) => ({ value: String(safra.id), label: safra.nome }));

        if (allSafras) {
          options.unshift({
            value: '_',
            label: 'Todos os Lançamentos'
          });
        }

        setSafrasOptions(options);
        setChangeSafra(options[0].value || '_');
      }
    }

    loadSafras();
  }, [hasSafraFilter, allSafras, setChangeSafra]);

  useEffect(() => {
    async function loadTalhoes() {
      if (hasTalhaoFilter && setChangeTalhao && selectedSafra && selectedSafra !== '_') {
        setChangeTalhao('_');

        const talhoesData = await TalhaoService.findTalhoes(selectedSafra);
        const talhoesOptions = talhoesData.map((talhao) => ({
          value: String(talhao.id),
          label: `${talhao.talhao} (${talhao.variedade})`
        }));
        talhoesOptions.unshift({
          value: '_', label: 'Todos os Talhões'
        });

        setTalhoesOptions(talhoesOptions);
      }
    }

    loadTalhoes();
  }, [hasTalhaoFilter, setChangeTalhao, selectedSafra]);

  return (
    <Container>
      {canGoBack && (
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="#F7FBFE" weight="bold" />
        </button>
      )}
      <div>
        <h1>{title}</h1>
        {subtitle && (
          <h2>{subtitle}</h2>
        )}
      </div>
      {hasSafraFilter && (
        <Select
          options={safrasOptions}
          placeholder="Safra"
          noOptionsMessage="0 safras encontrada"
          value={selectedSafra || ''}
          onChange={(safra: string) => {
            if (setChangeSafra) {
              setChangeSafra(safra);
            }
          }
          }
        />
      )}
      {(hasTalhaoFilter && selectedSafra !== '_') && (
        <Select
          options={talhoesOptions}
          placeholder="Talhão"
          noOptionsMessage="0 talhões encontrada"
          value={selectedTalhao || ''}
          onChange={(talhao: string) => {
            if (setChangeTalhao) {
              setChangeTalhao(talhao);
            }
          }
          }
        />
      )}
    </Container>
  );
}
