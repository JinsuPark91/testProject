/* eslint-disable class-methods-use-this */
import { observable } from 'mobx';
import { RoomStore as coreRoomStore } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import { PlatformRoomModel } from '../models/PlatformRoomModel';

const roomStore = observable({
  rooms: [],

  async getRooms(userId) {
    try {
      const [coreRooms, talkRooms] = await Promise.all([
        coreRoomStore.updateRoomList({ userId }),
        talkRoomStore.getRoomListAsync({ userId }),
      ]);

      const platformRooms = talkRooms.map(talkRoom => {
        const coreRoom = coreRooms[talkRoom.roomId];
        if (coreRoom) {
          return new PlatformRoomModel(coreRoom, talkRoom);
        }
      });
      this.rooms.replace(platformRooms);
    } catch (e) {
      console.log('Core Room Store Error', e);
    }
  },
});

export default roomStore;
