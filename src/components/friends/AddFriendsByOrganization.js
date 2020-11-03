import React, { useEffect, useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { Loader, useCoreStores } from 'teespace-core';
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
function AddFriendsByOrganization({ timestamp }) {
  const { orgStore, userStore } = useCoreStores();
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [dropdownDisplayValue, setDropdownDisplayValue] = useState('');
  const [dropdownDefaultValue, setDropdownDefaultValue] = useState('');

  const [loader] = Loader.useLoader();

  // dropdown의 item을 클릭했을 때
  const handleDropdownChange = useCallback(
    async value => {
      await orgStore.getUserOrgUserList(
        ...value.split('_'),
        userStore.myProfile.id,
      );
      setSearchedUserList(orgStore.userOrgUserList);
      setDropdownDisplayValue('');
    },
    [orgStore, userStore.myProfile.id],
  );

  useEffect(() => {
    (async () => {
      loader.loading();
      const { companyCode, departmentCode } =
        (await orgStore.getOrgUserDept(userStore.myProfile.id)) || {};
      const parsedValue = OrganizationDropdown.valueCreator({
        companyCode,
        departmentCode,
      });
      setDropdownDefaultValue(parsedValue);
      handleDropdownChange(parsedValue);
      loader.stop();
    })();
  }, [
    handleDropdownChange,
    orgStore,
    userStore.myProfile.id,
    timestamp,
    loader,
  ]);

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
    <Loader loader={loader}>
      <NegativeMargin>
        <AddFriendsByOrganizationHeader
          orgList={orgStore.orgList}
          orgUserSize={searchedUserList.length}
          onInputChange={handleInputChange}
          onDropdownChange={handleDropdownChange}
          overwrittenValue={dropdownDisplayValue}
          defaultValue={dropdownDefaultValue}
          timestamp={timestamp}
        />
        <StyledDivider />
        <AddFriendsByOrganizationContent orgUserList={searchedUserList} />
      </NegativeMargin>
    </Loader>
  ));
}

export default AddFriendsByOrganization;
