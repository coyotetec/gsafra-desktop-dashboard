import { Container } from './styles';
import { ArrowClockwise, ArrowLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
  headerFilter?: React.ReactNode;
  refreshData?: () => void;
}

export function Header({
  title,
  subtitle,
  canGoBack = false,
  headerFilter,
  refreshData,
}: HeaderProps) {
  const navigate = useNavigate();

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
      {headerFilter && headerFilter}
      {refreshData && (
        <button className='refresh-button' onClick={refreshData}>
          <ArrowClockwise size={24} color="#CFD4D6" weight="bold" />
        </button>
      )}
    </Container>
  );
}
