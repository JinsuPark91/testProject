import { observable } from 'mobx';
import { RoomStore, UserStore } from 'teespace-core';

const roomSettingStore = observable({
  // 유저 데이터 관련
  member: null,
  members: [],
  selectedMembers: new Map(),

  async fetchMembers({ roomId }) {
    try {
      const members = await RoomStore.fetchRoomMemberList({
        myUserId: UserStore.myProfile.id,
        roomId,
      });
      this.members = members;
    } catch (err) {
      console.log('member list get error : ', err);
    }
  },

  async fetchBlockedMembers({ roomId }) {
    try {
      const banInfos = await RoomStore.getBanList({
        roomId,
      });

      const userIdList = banInfos.map(({ userId }) => userId);

      let members = [];
      if (userIdList.length) {
        members = await UserStore.fetchProfileList(userIdList);
      }

      this.members = members;
    } catch (err) {
      console.log('blocked member list get error : ', err);
    }
  },

  async fetchRequestMembers({ roomId }) {
    try {
      const requests = await RoomStore.getRequestList({ roomId });

      const requestDateList = new Map();
      const userIdList = [];
      requests.forEach(request => {
        userIdList.push(request.userId);
        requestDateList.set(request.userId, request.reqRegDate);
      });

      if (userIdList.length) {
        const profiles = await UserStore.fetchProfileList({ userIdList });
        profiles.forEach(profile => {
          if (!Object.prototype.hasOwnProperty.call(profile, 'reqRegDate')) {
            Object.defineProperty(profile, 'reqRegDate', {
              value: requestDateList.get(profile.id),
            });
          }
        });
        this.members = profiles;
      } else {
        this.members = [];
      }
    } catch (err) {
      console.log('입장 요청 멤버 조회 에러 : ', err);
    }
  },

  async acceptUsers({ roomId, userIdList }) {
    try {
      const result = await RoomStore.acceptEnterRequests({
        roomId,
        userIdList,
      });

      if (result) {
        await this.fetchRequestMembers({ roomId });
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async rejectUsers({ roomId, userIdList }) {
    try {
      const result = await RoomStore.rejectEnterRequests({
        roomId,
        userIdList,
      });

      if (result) {
        await this.fetchRequestMembers({ roomId });
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async disableBan({ roomId, userIdList }) {
    try {
      const result = await RoomStore.deleteBanMembers({
        roomId,
        userIdList,
      });

      if (result) {
        await this.fetchRequestMembers({ roomId });
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async transferAdmin({ roomId, userId }) {
    try {
      await RoomStore.updateRoomLeader({
        roomId,
        userId,
      });

      return Promise.resolve();
    } catch (err) {
      console.log('transfer admin error : ', err);
      return Promise.reject();
    }
  },

  async kickoutMembers({ roomId, userIdList }) {
    try {
      const result = await RoomStore.createBanMembers({ roomId, userIdList });
      if (result) return Promise.resolve(true);
      return Promise.resolve(false);
    } catch (err) {
      console.log('강퇴 실패 : ', err);
      return Promise.reject();
    }
  },

  // 검색 관련
  keyword: '',
  get filteredMembers() {
    return (
      this.members?.filter(
        member =>
          !!member?.nick?.includes(this.keyword) ||
          !!member?.orgName?.includes(this.keyword) ||
          !!member?.position?.includes(this.keyword),
      ) || []
    );
  },

  get filteredMembersWithoutMe() {
    const myId = UserStore.myProfile.id;
    return this.filteredMembers.filter(member => member.id !== myId);
  },

  //  탭 관련
  tabKey: 'common',
  subTabKey: 'member',

  changeTab(key) {
    this.tabKey = key;
    if (this.tabKey === 'member') {
      this.subTabKey = 'member';
    }
  },

  changeSubTab(key) {
    this.subTabKey = key;
  },

  // 다이얼로그 관련
  transferVisible: false,
  kickoutVisible: false,
  inviteVisible: false,
  toastVisible: false,
  toastMessage: '',

  open(key, toastMessage = '') {
    this[`${key}Visible`] = true;
    if (key === 'toast') {
      this.toastMessage = toastMessage;
    }
  },

  close(key) {
    this[`${key}Visible`] = false;
    if (key === 'toast') {
      this.toastMessage = '';
    }
  },

  // 테이블 관련
  isAllChecked(withoutMe = false) {
    const members = withoutMe
      ? this.filteredMembersWithoutMe
      : this.filteredMembers;
    const { length } = members;

    if (!length) return false;

    for (let i = 0; i < length; i += 1) {
      if (!this.selectedMembers.has(members[i].id)) {
        return false;
      }
    }

    return true;
  },
});

export default roomSettingStore;
