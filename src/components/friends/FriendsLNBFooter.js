import React, { useState, useCallback } from 'react';
import { useCoreStores, Button } from 'teespace-core';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout } from 'antd';
import AddFriendsBySearch from './AddFriendsBySearch';
import { WaplLogo, FriendAddIcon } from '../Icons';
import { handleFriendsDialogType } from '../../utils/FriendsUtil';

const { Footer } = Layout;

const FooterWrapper = styled(Footer)`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0.75rem 0.69rem 0.75rem 0.94rem;
  background-color: #f5f5fb;
`;
const FriendAddButton = styled(Button)`
  &.ant-btn.ant-btn-outlined {
    display: flex;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    margin-left: auto;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #232d3b;
    border: none;
    padding: 0 0.38rem 0 0.63rem;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
`;

function FriendsLNBFooter() {
  const { orgStore, userStore, spaceStore, authStore } = useCoreStores();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isOrgExist, setIsOrgExist] = useState(false);
  const [spaceMemberList, setSpaceMemberList] = useState([]);

  const handleOpenAddFriendsDialog = useCallback(async () => {
    await handleFriendsDialogType(
      orgStore,
      userStore.myProfile,
      authStore.sessionInfo?.domainKey,
      () => setIsOrgExist(true),
      res => setSpaceMemberList(res),
    );
    setIsDialogVisible(!isDialogVisible);
  }, [orgStore, userStore, authStore, isDialogVisible]);

  const handleCloseAddFriendsDialog = useCallback(async () => {
    setIsDialogVisible(!isDialogVisible);
  }, [isDialogVisible]);

  return useObserver(() => (
    <FooterWrapper>
      <WaplLogo />
      <FriendAddButton type="outlined" onClick={handleOpenAddFriendsDialog}>
        <FriendAddIcon />
      </FriendAddButton>
      <AddFriendsBySearch
        visible={isDialogVisible}
        onCancelAddFriends={handleCloseAddFriendsDialog}
        isOrgExist={isOrgExist}
        title="프렌즈 추가"
        isViewMode={false}
        spaceInfo={spaceStore.currentSpace}
        spaceMemberList={spaceMemberList}
      />
    </FooterWrapper>
  ));
}

export default FriendsLNBFooter;
