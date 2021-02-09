import React, { useState, useCallback } from 'react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout, Tooltip } from 'antd';
import AddFriendsBySearch from './AddFriendsBySearch';
import { WaplLogo } from '../Icons';
import { handleFriendsDialogType } from '../../utils/FriendsUtil';
import FriendAddIcon from '../../assets/add_friends.svg';

const { Footer } = Layout;

const FooterWrapper = styled(Footer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: 0.63rem 0.94rem;
  background-color: #fff;
`;

const FriendAddButton = styled.div`
  display: flex;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);

  &:hover {
    background: #eae6e0;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }

  & > img {
    width: 1.38rem;
    height: 1.38rem;
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
      <Tooltip title="프렌즈 추가" placement="top" color="#232D3B">
        <FriendAddButton onClick={handleOpenAddFriendsDialog}>
          <img alt="friend" src={FriendAddIcon} />
        </FriendAddButton>
      </Tooltip>
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
