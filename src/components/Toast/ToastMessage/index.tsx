import { CheckCircle, XCircle } from 'phosphor-react';
import { useEffect } from 'react';
import { Message } from '../ToastContainer';
import { Container } from './styles';

interface ToastMessageProps {
  message: Message;
  onRemoveMessage: (id: number) => void;
}

export function ToastMessage({ message, onRemoveMessage }: ToastMessageProps) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRemoveMessage(message.id);
    }, message.duration || 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, onRemoveMessage]);

  function handleRemoveToast() {
    onRemoveMessage(message.id);
  }

  return (
    <Container
      type={message.type}
      onClick={handleRemoveToast}
      tabIndex={0}
      role="button"
    >
      {message.type === 'danger' && (
        <XCircle size={24} color="#F7FBFE" weight="bold" />
      )}
      {message.type === 'success' && (
        <CheckCircle size={24} color="#F7FBFE" weight="bold" />
      )}
      <strong>{message.text}</strong>
    </Container>
  );
}
