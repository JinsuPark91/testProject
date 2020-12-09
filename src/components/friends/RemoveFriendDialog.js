import React from 'react';
import { Modal, Typography } from 'antd';

const { Title } = Typography;

function RemoveFriendDialog({ visible }) {
  return (
    <Modal footer={null} visible={visible}>
      <Title level={3} />
    </Modal>
  );
}

export default RemoveFriendDialog;
