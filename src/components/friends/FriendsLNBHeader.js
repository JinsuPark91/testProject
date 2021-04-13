import React from 'react';
import { useTranslation } from 'react-i18next';
import AddFriendsButton from '../addfriends/AddFriendsButton';
import {
  SearchBox,
  FriendSearch,
} from '../../styles/friends/FriendsLNBHeaderStyle';

/**
 * @param {function} props.handleInputChange - 검색 값 change
 * @param {function} props.handleInputClear - 검색 값 clear
 */

const FriendsLNBHeader = ({ handleInputChange, handleInputClear }) => {
  const { t } = useTranslation();

  return (
    <SearchBox>
      <FriendSearch
        className="friendSearch"
        type="underline"
        searchIconColor={{ active: '#000', default: '#000' }}
        clearIconColor={{ active: '#17202B', default: '#C6CED6' }}
        onChange={handleInputChange}
        onClear={handleInputClear}
        placeholder={t('CM_B2C_LNB_EMPTY_PAGE_06')}
        isCountExist={false}
      />
      <AddFriendsButton />
    </SearchBox>
  );
};

export default React.memo(FriendsLNBHeader);
