import { observable } from 'mobx';
import { RoomStore, UserStore } from 'teespace-core';

const roomSettingStore = observable({
  targetMember: null,

  roomMembers: [],
  selectedRoomMembers: new Map(),

  requestMembers: [],
  selectedRequestMembers: new Map(),

  banMembers: [],
  selectedBanMembers: new Map(),

  async fetchMembers({ roomId }) {
    try {
      const members = await RoomStore.fetchRoomMemberList({
        myUserId: UserStore.myProfile.id,
        summary: false,
        roomId,
      });
      this.roomMembers = members;
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

      this.banMembers = members;
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
        this.requestMembers = profiles;
      } else {
        this.requestMembers = [];
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
  getFilteredMembers({ withoutMe = false }) {
    // mainTab member인 경우
    if (this.tabKey === 'member') {
      let targetList = [];
      switch (this.subTabKey) {
        case 'member':
          targetList = this.roomMembers;
          break;
        case 'request':
          targetList = this.requestMembers;
          break;
        case 'ban':
          targetList = this.banMembers;
          break;
        default:
          targetList = [];
          break;
      }

      // keyword로 거른다
      const filtered = targetList.filter(
        member =>
          !!member?.nick?.includes(this.keyword) ||
          !!member?.orgName?.includes(this.keyword) ||
          !!member?.position?.includes(this.keyword),
      );

      // 나를 제외한다
      if (withoutMe) {
        const myId = UserStore.myProfile.id;
        return filtered.filter(member => member.id !== myId);
      }

      return filtered;
    }

    // mainTab common인 경우
    return [];
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
    this.keyword = '';
    switch (this.subTabKey) {
      case 'member':
        this.selectedRoomMembers.clear();
        break;
      case 'request':
        this.selectedRequestMembers.clear();
        break;
      case 'ban':
        this.selectedBanMembers.clear();
        break;
      default:
        break;
    }
  },

  // 다이얼로그 관련
  inviteVisible: false,

  isAllChecked({ withoutMe = false }) {
    const members = this.getFilteredMembers({ withoutMe });
    const { length } = members;

    if (!length) return false;

    let targetSelectedMembers = null;
    switch (this.subTabKey) {
      case 'member':
        targetSelectedMembers = this.selectedRoomMembers;
        break;
      case 'request':
        targetSelectedMembers = this.selectedRequestMembers;
        break;
      case 'ban':
        targetSelectedMembers = this.selectedBanMembers;
        break;
      default:
        targetSelectedMembers = null;
        break;
    }

    if (targetSelectedMembers) {
      for (let i = 0; i < length; i += 1) {
        if (!targetSelectedMembers.has(members[i].id)) {
          return false;
        }
      }
      return true;
    }
    return false;
  },
});

export default roomSettingStore;
