import React, { useCallback } from 'react';
import { Observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { NoteIcon } from 'teespace-note-app';
import { DriveIcon, ViewFileIcon } from 'teespace-drive-app';
import { CalendarIcon } from 'teespace-calendar-app';
import { Wrapper, Title, AppIconContainer, UserMenu } from './HeaderStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

const apps = ['note', 'drive', 'calendar', 'files'];

const Header = () => {
  const history = useHistory();

  const handleAppClick = appName => {
    history.push({
      pathname: history.location.pathname,
      search: `?sub=${appName}`,
    });
  };

  const getAppIcon = appName => {
    const props = {
      key: appName,
      state: PlatformUIStore.subApp === appName ? 'active' : 'default',
      onClick: () => handleAppClick(appName),
    };

    switch (appName) {
      case 'note':
        return <NoteIcon {...props} />;
      case 'drive':
        return <DriveIcon {...props} />;
      case 'calendar':
        return <CalendarIcon {...props} />;
      case 'files':
        return <ViewFileIcon {...props} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Observer>
        {() => <Title>{`${PlatformUIStore.resourceId}`}</Title>}
      </Observer>

      <AppIconContainer>
        <Observer>{() => apps.map(appName => getAppIcon(appName))}</Observer>
      </AppIconContainer>

      <UserMenu>
        <span>User</span>
      </UserMenu>
    </Wrapper>
  );
};

export default Header;
