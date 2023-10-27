import React from 'react';
import { useModal } from "../../context/Modal";
import './OpenModalButton.css'

export default function OpenModalButton({
    modalComponent, //render this inside modal
    buttonText, //button text to open modal
    onButtonClick, //optional fcn, call when button to open modal clicked
    onModalClose, //optional fcn, call when modal is closed
    className
}) {
  const {setModalContent, setOnModalClose} = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <button className={className || ""} onClick={onClick}>{buttonText}</button>
  )
}
