import React, { useState, useCallback } from 'react';
import { useCoreStores, Button } from 'teespace-core';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout } from 'antd';
import AddFriendsBySearch from './AddFriendsBySearch';
import { WaplLogo, FriendAddIcon } from '../Icons';

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
    const response = await orgStore.getOrgTree();
    if (response && response.length) {
      setIsOrgExist(true);
    } else {
      const { myProfile } = userStore;
      try {
        const domainKey =
          process.env.REACT_APP_ENV === 'local'
            ? authStore.sessionInfo.domainKey
            : undefined;
        const res = await orgStore.getUserOrgUserList(
          myProfile?.companyCode,
          myProfile?.departmentCode,
          myProfile?.id,
          domainKey,
        );
        setSpaceMemberList(res);
      } catch (e) {
        console.log('getUserList Error');
      }
    }
    setIsDialogVisible(!isDialogVisible);
  }, [orgStore, isDialogVisible, userStore, authStore]);

  const handleCloseAddFriendsDialog = useCallback(async () => {
    setIsDialogVisible(!isDialogVisible);
  }, [isDialogVisible]);

  // <AddFriendsDialog
  //   visible={uiStore.visibleAddFriendsDialog}
  //   width={uiStore.addFriendsDialogInfo.width}
  //   height={uiStore.addFriendsDialogInfo.height}
  // />

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
