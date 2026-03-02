import { useEffect } from 'react';
import './Message.css';

interface MessageProps {
  type: 'success' | 'error';
  text: string;
  onClose: () => void;
  duration?: number;
}

export const Message = ({
  type,
  text,
  onClose,
  duration = 1500,
}: MessageProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <div className={`message message-${type}`}>
      {text}
    </div>
  );
};