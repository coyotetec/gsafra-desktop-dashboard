import { Svg } from './styles';

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 64 }: SpinnerProps) {
  return (
    <Svg viewBox="0 0 50 50" size={size}>
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      />
    </Svg>
  );
}
