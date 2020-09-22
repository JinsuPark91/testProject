import React, { useState } from 'react';
import { Button } from 'antd';
import CommonDialog from '../components/commons/Dialog';

function CommonIntroPage() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setModalVisible(true)}> Open CommonDialog</Button>
      <CommonDialog
        visible={modalVisible}
        closable
        title="공통 다이얼로그 (medium)"
        onCancel={() => setModalVisible(false)}
        size="medium"
      />
    </>
  );
}

export default CommonIntroPage;
