import React from 'react';
import { Divider } from 'antd';
import AddFriendsByInvitationLinkCopy from './AddFriendsByInvitationLinkCopy';
import AddFriendsByInvitationLinkSend from './AddFriendsByInvitationLinkSend';

function AddFriendsByInvitation() {
  return (
    <>
      <AddFriendsByInvitationLinkCopy />
      <Divider>OR</Divider>
      <AddFriendsByInvitationLinkSend />
    </>
  );
}

export default AddFriendsByInvitation;
