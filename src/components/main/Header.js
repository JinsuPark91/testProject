import React from 'react';
import { Observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { NoteIcon } from 'teespace-note-app';
import { DriveIcon, ViewFileIcon } from 'teespace-drive-app';
import { CalendarIcon } from 'teespace-calendar-app';
import { Wrapper, Title, AppIconContainer, UserMenu } from './HeaderStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

const Header = () => {
  const history = useHistory();

  return (
    <Wrapper>
      {/* 
          useObsever 사용 시 header 전체를 다시 그리는 반면,  
          Observer 사용 시, Title 부분만 다시 그릴수 있다.
      */}
      <Observer>
        {() => <Title>{`${PlatformUIStore.resourceId}`}</Title>}
      </Observer>

      <AppIconContainer>
        <Observer>
          {() => (
            <NoteIcon
              state={PlatformUIStore.subApp === 'note' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: '?sub=note',
                });
              }}
            />
          )}
        </Observer>
        <Observer>
          {() => (
            <DriveIcon
              state={PlatformUIStore.subApp === 'drive' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: '?sub=drive',
                });
              }}
            />
          )}
        </Observer>
        <Observer>
          {() => (
            <CalendarIcon
              state={
                PlatformUIStore.subApp === 'calendar' ? 'active' : 'default'
              }
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: '?sub=calendar',
                });
              }}
            />
          )}
        </Observer>
        <Observer>
          {() => (
            <ViewFileIcon
              state={PlatformUIStore.subApp === 'files' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: '?sub=files',
                });
              }}
            />
          )}
        </Observer>
      </AppIconContainer>

      <UserMenu>
        <span>User</span>
      </UserMenu>
    </Wrapper>
  );
};

export default Header;
