import React from 'react';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Wrapper, CustomTabs } from './LeftSideStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

const { TabPane } = CustomTabs;

const LeftSide = () => {
  const history = useHistory();

  const handleSelectTab = key => {
    PlatformUIStore.resourceType = key;

    // Main Page 내부에서 depth 맞추기 굉장히 어려움.
    if (key === 'm') {
      history.push(`/m/my-id/mail`);
    }
  };

  return useObserver(() => (
    <Wrapper>
      <CustomTabs
        activeKey={PlatformUIStore.resourceType}
        onTabClick={handleSelectTab}
        animated={false}
      >
        <TabPane key="f" tab={<span>Friend</span>}>
          <FriendList />
        </TabPane>

        <TabPane key="s" tab={<span>Room</span>}>
          <RoomList />
        </TabPane>

        <TabPane key="m" tab={<span>Mail</span>}>
          Mail LNB
        </TabPane>
      </CustomTabs>
    </Wrapper>
  ));
};

const FriendList = () => {
  const history = useHistory();
  const handleSelect = ({ id }) => {
    history.push(`/f/${id}/profile`);
  };

  return useObserver(() => (
    <ul>
      {PlatformUIStore.users.map(user => (
        <li
          key={user.id}
          onClick={() => {
            handleSelect(user);
          }}
          style={{
            cursor: 'pointer',
            padding: '5px',
            border: '1px solid #ccc',
          }}
        >
          <div>{user.name}</div>
        </li>
      ))}
    </ul>
  ));
};

const RoomList = () => {
  const history = useHistory();
  const handleSelect = ({ id }) => {
    history.push(`/s/${id}/talk`);
  };

  return useObserver(() => (
    <ul>
      {PlatformUIStore.rooms.map(room => (
        <li
          key={room.id}
          onClick={() => {
            handleSelect(room);
          }}
          style={{
            cursor: 'pointer',
            padding: '5px',
            border: '1px solid #ccc',
          }}
        >
          <div>{room.name}</div>
        </li>
      ))}
    </ul>
  ));
};

export default LeftSide;
