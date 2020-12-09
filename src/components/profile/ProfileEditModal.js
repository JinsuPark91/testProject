import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import Profile from '../Profile';
import { useProfileContext } from './ProfileContextProvider';

const ProfileEditMode = ({ userId, isEditMode }) => {
  const useProfile = useProfileContext();
  const toggleEditMode = useCallback(
    e => {
      if (typeof e === 'boolean')
        useProfile.setState({ editMode: e, infoMode: !e });
      else useProfile.setState({ editMode: true, infoMode: false });
    },
    [useProfile],
  );
  return (
    <ProfilePopup
      visible={useProfile.state.editMode}
      mask
      maskClosable={false}
      title={null}
      closable={false}
      footer={null}
      width="0px"
      style={{ margin: '0px 0px 0px 0px', padding: '0px 0px 0px 0px' }}
      transitionName=""
      maskTransitionName=""
    >
      <Wrapper isEditMode={isEditMode}>
        {useProfile.state.editMode && (
          <Profile
            userId={userId}
            editMode
            showSider={false}
            onModeChange={toggleEditMode}
          />
        )}
        <ProfileBottom />
      </Wrapper>
    </ProfilePopup>
  );
};
const Wrapper = styled.div`
  display: flex;
  font-size: 140.556%;
  position: fixed;
  top: 2.69rem;
  right: 20px;
  background: #fff;
  height: ${props => (props.isEditMode ? '22.94rem' : 'auto')};
  width: 17.06rem;
  flex-direction: column;
  border-radius: 4px;
  z-index: 1000;
  align-items: center;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
`;
const ProfilePopup = styled(Modal)`
  .ant-modal {
    width: 0px;
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
  }
  .ant-modal-content {
    height: 0px;
  }
  .ant-modal-body {
    padding: 0px;
  }
`;
const ProfileBottom = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 4px;
`;
export default ProfileEditMode;
