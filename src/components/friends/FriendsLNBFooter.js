import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout } from 'antd';
import { Button } from 'teespace-core';
import AddFriendsDialog from './AddFriendsDialog';
import { useStore } from '../../stores';
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

const AddFriendWrapper = styled.div``;

function FriendsLNBFooter() {
  const { uiStore } = useStore();

  const showAddFrieldsDialog = useCallback(() => {
    uiStore.showAddFriendsDialog();
  }, [uiStore]);

  return useObserver(() => (
    <FooterWrapper>
      <WaplLogo />
      <FriendAddButton type="outlined" onClick={showAddFrieldsDialog}>
        <FriendAddIcon />
      </FriendAddButton>
      <AddFriendsDialog
        visible={uiStore.visibleAddFriendsDialog}
        width={uiStore.addFriendsDialogInfo.width}
        height={uiStore.addFriendsDialogInfo.height}
      />
    </FooterWrapper>
  ));
}

export default FriendsLNBFooter;
