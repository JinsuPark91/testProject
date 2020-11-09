import { observable, values } from 'mobx';

const PlatformUIStore = observable({
  resourceType: 'rooms',
  resourceId: '',
  mainApp: 'talk',
  subApp: null,
  layout: 'collapse',

  // [TODO] : 추후 지우기
  users: [],
  setUsers(users) {
    this.users.replace(users);
  },

  rooms: [],
  addRoom(roomInfo) {
    this.rooms.push(roomInfo);
  },
  setRooms(rooms) {
    this.rooms.replace(rooms);
  },

  getUsers() {
    return new Promise(resolve => {
      setTimeout(() => {
        const users = [
          { id: 'u01', name: 'aaaa' },
          { id: 'u02', name: 'bbbb' },
          { id: 'u03', name: 'cccc' },
        ];

        this.setUsers(users);
        resolve(this.users);
      }, 1000);
    });
  },

  fetchRooms() {
    return new Promise(resolve => {
      setTimeout(() => {
        const rooms = [
          {
            id: 'r01',
            users: [1, 2, 3],
            lastMessage: '가나다1',
            name: 'room 01',
            unreadCount: 54,
          },
          {
            id: 'r02',
            users: [1, 2, 3],
            lastMessage: '가나다222222',
            name: 'room 02',
            unreadCount: 1,
          },
          {
            id: 'r03',
            users: [1, 2, 3],
            lastMessage: '가나다333333333',
            name: 'room 03',
            unreadCount: 0,
          },
          {
            id: 'r04',
            users: [1, 2, 3],
            lastMessage: '가나다444444444444',
            name: 'room 04',
            unreadCount: 30,
          },
        ];

        this.setRooms(rooms);
        resolve(this.rooms);
      }, 500);
    });
  },
});

export default PlatformUIStore;
