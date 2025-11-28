import React from "react";
import { ToastContainer } from "react-toastify";

const AlertMsg: React.FC = () => {
  return (
    <ToastContainer
      position="top-right"
      hideProgressBar={false}
      newestOnTop={false}
      pauseOnHover
    />
  );
};

export default AlertMsg;