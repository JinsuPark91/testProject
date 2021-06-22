import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, Menu } from 'antd';
import { Observer } from 'mobx-react';
import { Icons, useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

const StatusSelector = ({ selectable = false }) => {
  const { uiStore } = useStores();
  const { userStore } = useCoreStores();
  const [isSelected, setIsSelected] = useState(false);

  const {
    ProfileEmoticonEmptyIcon,
    ProfileEmoticonNormalIcon,
    ProfileEmoticonMissedIcon,
    ProfileEmoticonVacationIcon,
    ProfileEmoticonMeetingIcon,
    CommonAddIcon,
  } = Icons;
  const statusMap = {
    '상태 없음': 'STA0000',
    '연락 가능': 'STA0001',
    부재중: 'STA0002',
    휴가중: 'STA0003',
    회의중: 'STA0004',
  };

  const handleVisibleChange = visible => {
    if (visible) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  };

  useEffect(() => {
    const code = userStore.myProfile.status;
    uiStore.setStatusCode(code);
  }, []);

  const renderIcon = (code, isForSelector) => {
    if (code === 'STA0001') {
      return <ProfileEmoticonNormalIcon width={0.875} height={0.875} />;
    }
    if (code === 'STA0002') {
      return <ProfileEmoticonMissedIcon width={0.875} height={0.875} />;
    }
    if (code === 'STA0003') {
      return <ProfileEmoticonVacationIcon width={0.875} height={0.875} />;
    }
    if (code === 'STA0004') {
      return <ProfileEmoticonMeetingIcon width={0.875} height={0.875} />;
    }
    if (isForSelector) {
      return (
        <CommonAddIcon
          width={0.875}
          height={0.875}
          color={isSelected ? '#000' : '#fff'}
        />
      );
    }
    return <ProfileEmoticonEmptyIcon width={0.875} height={0.875} />;
  };

  const statusArray = Object.keys(statusMap);

  const menu = (
    <NewMenu>
      {statusArray.map(status => {
        const statusCode = statusMap[status];
        const handleClick = async () => {
          uiStore.setStatusCode(statusCode);
          setIsSelected(false);
          await userStore.updateProfileStatus({ status: statusCode });
        };
        return (
          <MenuItem key={status} onClick={handleClick}>
            {renderIcon(statusCode)}
            <MenuText>{status}</MenuText>
          </MenuItem>
        );
      })}
    </NewMenu>
  );

  return (
    <Observer>
      {() => (
        <>
          {selectable && (
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomLeft"
              onVisibleChange={handleVisibleChange}
            >
              <Wrapper
                className={
                  isSelected
                    ? 'selected selector-selectable'
                    : 'selector-selectable'
                }
              >
                {renderIcon(uiStore.statusCode, true)}
                <StyledButton>{uiStore.statusText}</StyledButton>
              </Wrapper>
            </Dropdown>
          )}
          {!selectable && (
            <Wrapper>
              {renderIcon(uiStore.statusCode, true)}
              <StyledButton>{uiStore.statusText}</StyledButton>
            </Wrapper>
          )}
        </>
      )}
    </Observer>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-width: 0px;
  border-radius: 4px;
  font-size: 0.688rem;
  color: #ffffff;
  width: 6rem;
  height: 1.438rem;
  background: rgba(255, 255, 255, 0.1);
  &.selector-selectable {
    cursor: pointer;
    &:hover {
      background: rgba(250, 248, 247, 0.3);
    }
    &.selected {
      background: rgba(242, 239, 236, 0.5);
      color: #000000;
    }
  }
`;

const StyledButton = styled.div`
  margin-left: 0.375rem;
`;

const MenuText = styled.span`
  width: 2.688rem;
  height: 1.25rem;
  margin-left: 0.375rem;
  font-size: 0.688rem;
  color: #ffffff;
`;

const MenuItem = styled(Menu.Item)``;

const NewMenu = styled(Menu)`
  left: 6.25rem;
  top: -1.8rem;
  width: 6rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-width: 0px;
  padding: 0;
  & > .ant-dropdown-menu-item {
    margin: 0.187rem 0;
  }
  & .ant-dropdown-menu-item:hover {
    background: rgba(250, 248, 247, 0.3);
  }
  & .ant-dropdown-menu-item:active {
    background: rgba(242, 239, 236, 0.5);
    & span {
      color: #000;
    }
  }
`;

export default StatusSelector;
