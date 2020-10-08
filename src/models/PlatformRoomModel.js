// eslint-disable-next-line import/prefer-default-export
export class PlatformRoomModel {
  constructor(core, talk) {
    this.core = core;
    this.talk = talk;
  }

  get name() {
    return this.talk.uids;
  }

  get lastMessage() {
    return this.talk.lastMessage.body;
  }

  get unreadCount() {
    return this.talk.unreadCount;
  }

  set name(name) {
    this.talk.uids = name;
  }

  set lastMessage(lastMessage) {
    this.talk.lastMessage = lastMessage;
  }

  set unreadCount(unreadCount) {
    this.talk.unreadCount = unreadCount;
  }
}
