import { observable } from 'mobx';

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

  getRooms() {
    return new Promise(resolve => {
      setTimeout(() => {
        const rooms = [
          { id: 'r01', name: 'room 01' },
          { id: 'r02', name: 'room 02' },
          { id: 'r03', name: 'room 03' },
          { id: 'r04', name: 'room 04' },
        ];

        this.setRooms(rooms);
        resolve(this.rooms);
      }, 500);
    });
  },
});

export default PlatformUIStore;
