import React, { useEffect, useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { Loader, useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Divider } from 'antd';
import AddFriendsByOrganizationHeader from './AddFriendsByOrganizationHeader';
import AddFriendsByOrganizationContent from './AddFriendsByOrganizationContent';
import AddFriendsItem from './AddFriendsItem';
import OrganizationDropdown from './OrganizationDropdown';
import PlatformUIStore from '../../stores/PlatformUIStore';

const Wrapper = styled.div`
  width: 100%;
  padding: 0.63rem 0.81rem 0.63rem 0.63rem;
`;

const StyledDivider = styled(Divider)`
  margin: 0;
`;

function AddFriendsByOrganization({ timestamp, searchText }) {
  const { orgStore, userStore, authStore } = useCoreStores();
  const [isOpen, setIsOpen] = useState(false);
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [dropdownDisplayValue, setDropdownDisplayValue] = useState('');
  const [dropdownDefaultValue, setDropdownDefaultValue] = useState('');

  const [loader] = Loader.useLoader();

  // dropdown의 item을 클릭했을 때
  const handleDropdownChange = useCallback(
    async value => {
      const domainKey =
        process.env.REACT_APP_ENV === 'local'
          ? authStore.sessionInfo.domainKey
          : undefined;
      await orgStore.getUserOrgUserList(
        ...value.split('_'),
        userStore.myProfile.id,
        domainKey,
      );
      setSearchedUserList(orgStore.userOrgUserList);
      console.log(orgStore.userOrgUserList);
      setDropdownDisplayValue('');
    },
    [orgStore, userStore, authStore],
  );

  const handleSearch = useCallback(async () => {
    const userList = await userStore.searchUsersByKeyword({
      keyword: searchText,
    });
    setSearchedUserList(userList);
    if (userList.length) {
      const { companyCode, departmentCode } = userList[0];
      setDropdownDisplayValue(
        OrganizationDropdown.valueCreator({ companyCode, departmentCode }),
      );
    }
  }, [searchText, userStore]);

  useEffect(() => {
    (async () => {
      if (!isOpen) {
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
        setIsOpen(true);
      } else if (searchText === '') {
        setSearchedUserList(orgStore.userOrgUserList);
        setDropdownDisplayValue('');
      } else {
        handleSearch();
      }
    })();
  }, [
    handleDropdownChange,
    orgStore,
    userStore.myProfile.id,
    timestamp,
    loader,
    isOpen,
    searchText,
    handleSearch,
  ]);

  return useObserver(() => (
    <Loader loader={loader}>
      <Wrapper>
        <AddFriendsByOrganizationHeader
          orgList={orgStore.orgList}
          orgUserSize={searchedUserList.length}
          onDropdownChange={handleDropdownChange}
          overwrittenValue={dropdownDisplayValue}
          defaultValue={dropdownDefaultValue}
          timestamp={timestamp}
        />
        <StyledDivider />
        <AddFriendsItem friendAddList={searchedUserList} />
      </Wrapper>
    </Loader>
  ));
}

export default AddFriendsByOrganization;
