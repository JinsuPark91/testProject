/* eslint-disable no-underscore-dangle */
import { observable } from 'mobx';

const mobileStore = observable({
  __deleteRoomIdList: [],
  settingKeyName: 'member',

  __openRoomOption: {
    roomName: '',
    secret: false,
  },

  setDeleteRoomIdList(roomId) {
    const roomIdSet = new Set(this.__deleteRoomIdList);
    if (roomIdSet.has(roomId)) roomIdSet.delete(roomId);
    else roomIdSet.add(roomId);

    this.__deleteRoomIdList = Array.from(roomIdSet);
  },

  get deleteRoomIdList() {
    return this.__deleteRoomIdList;
  },

  clearDeleteRoomIdList() {
    this.__deleteRoomIdList = [];
  },

  setOpenRoomNameOption(roomName) {
    this.__openRoomOption = {
      ...this.__openRoomOption,
      roomName,
    };
  },

  setOpenRoomSecretOption(bool) {
    this.__openRoomOption = {
      ...this.__openRoomOption,
      secret: bool,
    };
  },

  get openRoomOption() {
    return this.__openRoomOption;
  },

  clearOpenRoomOption() {
    this.__openRoomOption = {
      roomName: '',
      secret: false,
    };
  },

  keyword: '',
  getFilteredMembers(targetList) {
    const filtered = targetList.filter(
      member =>
        !!member?.nick?.includes(this.keyword) ||
        !!member?.orgName?.includes(this.keyword) ||
        !!member?.position?.includes(this.keyword),
    );

    return filtered;
  },
});

export default mobileStore;
