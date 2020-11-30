import React from 'react';
import { useObserver } from 'mobx-react';
import { MailSideView } from 'teespace-mail-app';
import { ChattingIcon, MailIcon, PeopleIcon } from '../Icons';
import FriendLnb from '../friends/FriendsLNB';
import RoomList from '../Rooms/RoomList';
import { Wrapper, CustomTabs } from './LeftSideStyle';
import PlatformUIStore from '../../stores/PlatformUIStore';

const { TabPane } = CustomTabs;

const LeftSide = () => {
  const handleSelectTab = key => {
    PlatformUIStore.tabType = key;
  };

  return useObserver(() => (
    <Wrapper>
      <CustomTabs
        activeKey={PlatformUIStore.tabType}
        onTabClick={handleSelectTab}
        animated={false}
      >
        <TabPane key="f" tab={<PeopleIcon />}>
          <FriendLnb />
        </TabPane>

        <TabPane key="s" tab={<ChattingIcon />}>
          <RoomList />
        </TabPane>

        <TabPane key="m" tab={<MailIcon />}>
          <MailSideView />
        </TabPane>
      </CustomTabs>
    </Wrapper>
  ));
};

export default LeftSide;

// const FriendList = () => {
//   const history = useHistory();
//   const handleSelect = ({ id }) => {
//     history.push(`/f/${id}/profile`);
//   };

//   return useObserver(() => (
//     <ul>
//       {PlatformUIStore.users.map(user => (
//         <li
//           key={user.id}
//           onClick={() => {
//             handleSelect(user);
//           }}
//           style={{
//             cursor: 'pointer',
//             padding: '5px',
//             border: '1px solid #ccc',
//           }}
//         >
//           <div>{user.name}</div>
//         </li>
//       ))}
//     </ul>
//   ));
// };

// const RoomList = () => {
//   const history = useHistory();
//   const handleSelect = ({ id }) => {
//     history.push(`/s/${id}/talk`);
//   };

//   return useObserver(() => (
//     <ul>
//       {PlatformUIStore.rooms.map(room => (
//         <li
//           key={room.id}
//           onClick={() => {
//             handleSelect(room);
//           }}
//           style={{
//             cursor: 'pointer',
//             padding: '5px',
//             border: '1px solid #ccc',
//           }}
//         >
//           <div>{room.name}</div>
//         </li>
//       ))}
//     </ul>
//   ));
// };
