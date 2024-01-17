import { useCallback, useEffect, useState } from 'react';
import { toastEventManager, ToastPayload } from '../../../utils/toast';
import { ToastMessage } from '../ToastMessage';
import { Container } from './styles';

export interface Message extends ToastPayload {
  id: number;
}

export function ToastContainer() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    function handleAddToast({ type, text, duration }: ToastPayload) {
      setMessages((prevState) => [
        ...prevState,
        { id: Math.random(), type, text, duration },
      ]);
    }

    toastEventManager.on('addtoast', handleAddToast);

    return () => {
      toastEventManager.removeListener('addtoast', handleAddToast);
    };
  }, []);

  const handleRemoveMessage = useCallback((id: number) => {
    setMessages((prevState) =>
      prevState.filter((message) => message.id !== id),
    );
  }, []);

  return (
    <Container>
      {messages.map((message) => (
        <ToastMessage
          key={message.id}
          message={message}
          onRemoveMessage={handleRemoveMessage}
        />
      ))}
    </Container>
  );
}
