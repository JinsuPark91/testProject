import { observable } from 'mobx';

const FriendStore = observable({
  activeFriendId: '',
  actvieFavFriendId: '',

  setActiveFriendId(targetId) {
    this.activeFriendId = targetId;
    this.activeFriendId = '';
  },

  setActiveFavFriendId(targetId) {
    this.activeFriendId = '';
    this.activeFriendId = targetId;
  },

  get friendId() {
    return this.activeFriendId;
  },

  get favFriendId() {
    return this.actvieFavFriendId;
  },
});

export default FriendStore;
