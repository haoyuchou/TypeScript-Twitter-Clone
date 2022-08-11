import React, { Fragment } from "react";

interface Props {
  onClose: () => void;
  children: any
}

export const BackDrop = ({ onClose }: Props) => {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen z-20 bg-transparent overflow-hidden"
      onClick={onClose}
    />
  );
};

export const ModalOverlay = (props: any) => {
  return (
    <div className="absolute top-3 right-6 shadow-lg rounded-lg text-sm bg-white z-30 p-3">
      <div className="p-0">{props.children}</div>
    </div>
  );
};

function Modal({ onClose, children }: Props) {
  return (
    <Fragment>
      <div
        className="fixed top-0 left-0 h-screen w-screen z-20 bg-transparent overflow-hidden"
        onClick={onClose}
      />
      <div className="absolute top-3 right-6 shadow-lg rounded-lg text-sm bg-white z-30 p-3">
        <div className="p-0">{children}</div>
      </div>
    </Fragment>
  );
}

export default Modal;
