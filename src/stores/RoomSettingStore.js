import { observable } from 'mobx';
import { RoomStore, UserStore } from 'teespace-core';

const RoomSettingStore = observable({
  // 유저 데이터 관련
  member: null,
  members: [],
  waitingMembers: [],
  blockedMemebers: [],
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

  fetchWaitingMembers() {},
  fetchBlockedMembers() {},

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

  async kickoutMembers({ roomId }) {
    // // TODO : 벌크로 내쫒을수 있어야 함. 너무 느림
    const serviceCalls = Array.from(this.selectedMembers.values()).map(member =>
      RoomStore.deleteRoomMember({
        userId: UserStore.myProfile.id,
        roomId,
        memberId: member.id,
      }),
    );

    try {
      await Promise.all(serviceCalls);
      return Promise.resolve();
    } catch (err) {
      console.log('강퇴 실패 : ', err);
      return Promise.reject();
    }
  },

  // 검색 관련
  keyword: '',
  get filteredMembers() {
    return this.members.filter(member => member.name.includes(this.keyword));
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

export { RoomSettingStore };
