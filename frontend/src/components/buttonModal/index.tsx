import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ButtonModal = ({ buttonText, buttonShape="default", buttonSize = 'middle', buttonIcon, modalTitle, okText = '', onFinish, cancelText = 'Close', children }: {
  buttonText?: JSX.Element | string;
  buttonShape?: 'circle' | 'round' | 'default';
  buttonSize?: 'small' | 'middle' | 'large';
  buttonIcon?: JSX.Element | undefined;
  modalTitle: string;
  okText?: string | undefined;
  onFinish?: () => void | undefined;
  cancelText: string;
  children: JSX.Element;
}) => {
  const [visible, setVisible] = useState(false);
  const handleOpen = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  // get footer based on props
  const footer = [];
  if(okText && onFinish) {
    footer.push(
      <Button key="submit" type="primary" onClick={onFinish}>
        {okText}
      </Button>
    );
  }
  if(cancelText) {
    footer.push(
      <Button key="back" onClick={handleClose}>
        {cancelText}
      </Button>
    );
  }
  return (
    <>
      {buttonIcon ? <Button shape={buttonShape} icon={buttonIcon} size={buttonSize} onClick={handleOpen} /> : <Button size={buttonSize} onClick={handleOpen}>
        {buttonText}
      </Button>}
      <Modal forceRender open={visible} title={modalTitle}
        closable={false}
        footer={footer}>
        {children}
      </Modal>
    </>
  );
};

export default ButtonModal;
