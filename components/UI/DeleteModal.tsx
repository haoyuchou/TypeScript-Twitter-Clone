import React from "react";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
  onYesClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  onNoClick: () => void;
  suggestText: string;
}

function DeleteModal({ onClose, onYesClick, onNoClick, suggestText }: Props) {
  return (
    <Modal
      className="bg-gray-100 bg-opacity-90 z-40"
      onClose={onClose}
      overlayClassname="z-50 rounded-xl shadow-xl fixed top-[200px] w-[40%] mx-auto h-60 md:h-40 bg-white"
    >
      <p className="text-black text-center pt-6 font-bold text-lg mb-4">
        {suggestText}
      </p>
      <div className="flex space-x-2 place-content-center">
        <button
          onClick={onYesClick}
          className="text-white bg-[#00ADED] rounded-md px-4 py-1"
        >
          Yes
        </button>
        <button
          onClick={onNoClick}
          className="text-[#00ADED] bg-white rounded-md px-4 py-1"
        >
          No
        </button>
      </div>
    </Modal>
  );
}

export default DeleteModal;
