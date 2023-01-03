import ReactDOM from 'react-dom';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';
import { Overlay } from './styles';

interface LoaderProps {
  isLoading: boolean;
}

export function Loader({ isLoading }: LoaderProps) {
  const { shouldRender, animatedElementRef } = useAnimatedUnmount(isLoading);

  if (!shouldRender) {
    return null;
  }

  return ReactDOM.createPortal(
    <Overlay ref={animatedElementRef} isLeaving={!isLoading}>
      <svg className="spinner" viewBox="0 0 50 50">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
    </Overlay>,
    document.getElementById('loader-root') as HTMLElement,
  );
}
