import React, { useEffect, useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Divider } from 'antd';
import AddFriendsByOrganizationHeader from './AddFriendsByOrganizationHeader';
import AddFriendsByOrganizationContent from './AddFriendsByOrganizationContent';

const NegativeMargin = styled.div`
  margin: -16px;
`;

const StyledDivider = styled(Divider)`
  margin: 0;
`;
function AddFriendsByOrganization() {
  const [searchedUserList, setSearchedUserList] = useState([]);

  const { orgStore, userStore } = useCoreStores();

  useEffect(() => {
    orgStore.getOrgTree();
  }, [orgStore]);

  const handleInputChange = useCallback(
    async e => {
      const userList = await userStore.searchUsersByKeyword({
        keyword: e.target.value,
      });
      setSearchedUserList(userList);
    },
    [userStore],
  );

  const handleDropdownChange = useCallback(
    async value => {
      const orgUserList = await orgStore.getOrgUserList(...JSON.parse(value));
      setSearchedUserList(orgUserList);
    },
    [orgStore],
  );

  return useObserver(() => (
    <NegativeMargin>
      <AddFriendsByOrganizationHeader
        orgList={orgStore.orgList}
        orgUserSize={searchedUserList.length}
        onInputChange={handleInputChange}
        onDropdownChange={handleDropdownChange}
      />
      <StyledDivider />
      <AddFriendsByOrganizationContent orgUserList={searchedUserList} />
    </NegativeMargin>
  ));
}

export default AddFriendsByOrganization;
