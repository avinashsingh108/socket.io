import React, { useEffect, useState } from "react";

const Notification = ({ message, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-sm px-4 py-2 rounded-md shadow-lg notification">
      {message}
    </div>
  );
};

export default Notification;
