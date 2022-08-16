import React, { Fragment } from "react";

interface Props {
  onClose: () => void;
  children?: any;
  className?: string;
  overlayClassname: string;
}

export const BackDrop = ({ onClose, className }: Props) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-screen z-20 overflow-hidden ${className}`}
      onClick={onClose}
    />
  );
};

export const ModalOverlay = ({ children }: any) => {
  return (
    <div className="absolute top-3 right-6 shadow-lg rounded-lg text-sm bg-white z-30 p-3">
      <div className="p-0">{children}</div>
    </div>
  );
};

function Modal({ onClose, children, className, overlayClassname }: Props) {
  return (
    <Fragment>
      <div
        className={`fixed top-0 left-0 h-screen w-screen overflow-hidden ${className}`}
        onClick={onClose}
      />
      <div className={`${overlayClassname} p-3 overflow-hidden`}>
        <div className="p-0">{children}</div>
      </div>
    </Fragment>
  );
}

export default Modal;
