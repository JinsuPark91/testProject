import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';
import AddFriendsButton from './AddFriendsButton';
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
  const themeContext = useContext(ThemeContext);

  return (
    <SearchBox>
      <FriendSearch
        className="friendSearch"
        type="underline"
        searchIconColor={{
          active: themeContext.IconActive2,
          default: themeContext.TextHinted,
        }}
        clearIconColor={{
          active: themeContext.ClearActiveIcon,
          default: themeContext.ClearNormalIcon,
        }}
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
