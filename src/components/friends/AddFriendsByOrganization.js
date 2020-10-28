import React, { useEffect, useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Divider } from 'antd';
import AddFriendsByOrganizationHeader from './AddFriendsByOrganizationHeader';
import AddFriendsByOrganizationContent from './AddFriendsByOrganizationContent';
import OrganizationDropdown from './OrganizationDropdown';

const NegativeMargin = styled.div`
  margin: -1rem;
`;

const StyledDivider = styled(Divider)`
  margin: 0;
`;
function AddFriendsByOrganization() {
  const { orgStore, userStore } = useCoreStores();
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [dropdownDisplayValue, setDropdownDisplayValue] = useState('');

  // dropdown의 item을 클릭했을 때
  const handleDropdownChange = useCallback(async () => {
    setSearchedUserList(orgStore.userOrgUserList);
    setDropdownDisplayValue('');
  }, [orgStore]);

  // 입력창에 입력했을 때
  const handleInputChange = useCallback(
    async e => {
      if (e.target.value === '') {
        setSearchedUserList(orgStore.userOrgUserList);
        setDropdownDisplayValue('');
      } else {
        const userList = await userStore.searchUsersByKeyword({
          keyword: e.target.value,
        });
        setSearchedUserList(userList);
        if (userList.length) {
          const { companyCode, departmentCode } = userList[0];
          setDropdownDisplayValue(
            OrganizationDropdown.valueCreator({ companyCode, departmentCode }),
          );
        }
      }
    },
    [orgStore, userStore],
  );

  return useObserver(() => (
    <NegativeMargin>
      <AddFriendsByOrganizationHeader
        orgList={orgStore.orgList}
        orgUserSize={searchedUserList.length}
        onInputChange={handleInputChange}
        onDropdownChange={handleDropdownChange}
        overwrittenValue={dropdownDisplayValue}
      />
      <StyledDivider />
      <AddFriendsByOrganizationContent orgUserList={searchedUserList} />
    </NegativeMargin>
  ));
}

export default AddFriendsByOrganization;
