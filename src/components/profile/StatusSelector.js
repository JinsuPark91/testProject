import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Dropdown, Button, Menu } from 'antd';
import 'antd/dist/antd.css';
import { Observer } from 'mobx-react';
import { Icons, useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';

const StatusSelector = () => {
  const { uiStore } = useStores();
  const { userStore } = useCoreStores();
  const {
    ProfileEmoticonEmptyIcon,
    ProfileEmoticonNormalIcon,
    ProfileEmoticonMissedIcon,
    ProfileEmoticonVacationIcon,
    ProfileEmoticonMeetingIcon,
  } = Icons;
  const statusMap = {
    '상태 없음': 'STA0000',
    '연락 가능': 'STA0001',
    부재중: 'STA0002',
    휴가중: 'STA0003',
    회의중: 'STA0004',
  };

  useEffect(() => {
    const code = userStore.myProfile.status;
    uiStore.setStatusCode(code);
  }, []);

  const renderIcon = code => {
    if (code === 'STA0001') {
      return <ProfileEmoticonNormalIcon width={1.2} height={1.2} />;
    }
    if (code === 'STA0002') {
      return <ProfileEmoticonMissedIcon width={1.2} height={1.2} />;
    }
    if (code === 'STA0003') {
      return <ProfileEmoticonVacationIcon width={1.2} height={1.2} />;
    }
    if (code === 'STA0004') {
      return <ProfileEmoticonMeetingIcon width={1.2} height={1.2} />;
    }
    return <ProfileEmoticonEmptyIcon width={1.2} height={1.2} />;
  };

  const statusArray = Object.keys(statusMap);

  const menu = (
    <NewMenu>
      {statusArray.map(status => {
        const statusCode = statusMap[status];
        const handleClick = async () => {
          await userStore.updateProfileStatus({ status: statusCode });
          uiStore.setStatusCode(statusCode);
          console.log(status);
          console.log(statusCode);
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
        <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
          <StyledButton icon={renderIcon(uiStore.statusCode)}>
            {uiStore.statusText}
          </StyledButton>
        </Dropdown>
      )}
    </Observer>
  );
};

const StyledButton = styled(Button)`
  border-width: 0px;
  width: 6rem;
  height: 1.438rem;
  border-radius: 4px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
`;

const MenuText = styled.span`
  width: 2.688rem;
  height: 1.25rem;
  line-height: 1.25rem;
  font-family: NotoSansCJKkr;
  font-size: 0.688rem;
  color: #ffffff;
`;

const MenuItem = styled(Menu.Item)`
  line-height: 1.25rem;
`;

const NewMenu = styled(Menu)`
  left: 6rem;
  width: 5.188rem;
  height: 8.75rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
`;

export default StatusSelector;
