import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from '@components/Menu/styles';

interface Props {
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({ children, style, onCloseModal, closeButton }) => {
  // 이벤트 버블링 막기
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

// props들의 기본값 설정
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
