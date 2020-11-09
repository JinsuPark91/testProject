import React from 'react';
import { Observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
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
        <span
          style={{
            padding: '5px',
            border: '1px solid black',
            cursor: 'pointer',
          }}
          onClick={() => {
            history.push({
              // useRouteMatch url 써도 되지만, Header 컴포넌트가 re-render 된다.
              // useParams 또한, re-render 되므로 주의
              pathname: history.location.pathname,
              search: '?sub=note',
            });
          }}
        >
          Note
        </span>
        <span
          style={{
            padding: '5px',
            border: '1px solid black',
            cursor: 'pointer',
          }}
          onClick={() => {
            history.push({
              pathname: history.location.pathname,
              search: '?sub=drive',
            });
          }}
        >
          Drive
        </span>
        <span
          style={{
            padding: '5px',
            border: '1px solid black',
            cursor: 'pointer',
          }}
          onClick={() => {
            history.push({
              pathname: history.location.pathname,
              search: '?sub=schedule',
            });
          }}
        >
          Calendar
        </span>
      </AppIconContainer>
      <UserMenu>
        <span>User</span>
      </UserMenu>
    </Wrapper>
  );
};

export default Header;
