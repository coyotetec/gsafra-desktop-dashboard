import { useEffect, useState } from 'react';
import { Container } from './styles';

import { Select } from '../Select';

import SafraService from '../../services/SafraService';
import { ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
  hasSafraFilter?: boolean;
  setChangeSafra?: React.Dispatch<React.SetStateAction<string>>;
  selectedSafra?: string;
  canGoBack?: boolean
}

type optionType = {
  value: string;
  label: string;
}[]

export function Header({
  title,
  subtitle,
  hasSafraFilter = true,
  setChangeSafra,
  selectedSafra,
  canGoBack = false
}: HeaderProps) {
  const [safrasOptions, setSafrasOptions] = useState<optionType>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSafras() {
      if (!hasSafraFilter) {
        const safrasData = await SafraService.findSafras();

        const options = safrasData.map((safra) => ({ value: String(safra.id), label: safra.nome }));

        options.unshift({
          value: '_',
          label: 'Todos os Lançamentos'
        });

        setSafrasOptions(options);
      }
    }

    loadSafras();
  }, [hasSafraFilter]);

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
      {!hasSafraFilter && (
        <Select
          options={safrasOptions}
          placeholder="Safra"
          noOptionsMessage="0 safras encontrada"
          value={selectedSafra || ''}
          onChange={(safra) => {
            if (setChangeSafra) {
              setChangeSafra(safra);
            }
          }
          }
        />
      )}
    </Container>
  );
}
