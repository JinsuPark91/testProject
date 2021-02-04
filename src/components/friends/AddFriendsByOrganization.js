import React, { useEffect, useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
import { Loader, useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import AddFriendsByOrganizationHeader from './AddFriendsByOrganizationHeader';
import AddFriendsItem from './AddFriendsItem';
import OrganizationDropdown from './OrganizationDropdown';

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0.94rem;
`;

function AddFriendsByOrganization({ timestamp, searchText, isViewMode }) {
  const { orgStore, userStore } = useCoreStores();
  const [isOpen, setIsOpen] = useState(false);
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [dropdownDisplayValue, setDropdownDisplayValue] = useState('');
  const [dropdownDefaultValue, setDropdownDefaultValue] = useState('');
  const [selectedValue, setSelectedValue] = useState();

  const [loader] = Loader.useLoader();

  // dropdown의 item을 클릭했을 때
  const handleDropdownChange = useCallback(
    async value => {
      await orgStore.getOrgUserList(...value.split('_'));
      setSearchedUserList(orgStore.orgUserList);
      setDropdownDisplayValue('');
      setSelectedValue(value);
    },
    [orgStore],
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
        // 검색 내용이 비워져 있는 경우 기존에 선택되었던 조직 목록으로 이동함.
        if (selectedValue) {
          handleDropdownChange(selectedValue);
        }
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
        <AddFriendsItem
          friendAddList={searchedUserList}
          isViewMode={isViewMode}
        />
      </Wrapper>
    </Loader>
  ));
}

export default AddFriendsByOrganization;
