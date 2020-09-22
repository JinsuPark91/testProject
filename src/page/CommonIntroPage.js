import React, { useState } from 'react';
import { Button } from 'antd';
import CommonDialog from '../components/commons/Dialog';
import CommonButton from '../components/commons/Button';

function CommonIntroPage() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <CommonButton onClick={() => setModalVisible(true)}> Open CommonDialog</CommonButton>
      <CommonDialog
        visible={modalVisible}
        closable
        title="공통 다이얼로그 (medium)"
        onCancel={() => setModalVisible(false)}
        size="medium"
      >
        <div>Hello Dialog</div>
      </CommonDialog>
      <CommonButton type="solid">Text</CommonButton>
      <CommonButton type="solid" disabled>Text</CommonButton>
      <CommonButton type="outlined">Text</CommonButton>
    </>
  );
}

export default CommonIntroPage;
