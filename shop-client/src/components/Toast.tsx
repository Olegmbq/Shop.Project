import React, { useEffect } from "react";
import "../styles/toast.css";

interface Props {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="toast">{message}</div>;
};

export default Toast;
