/* eslint-disable no-underscore-dangle */
import { observable, transaction, values } from 'mobx';
import { RoomStore, FriendStore } from 'teespace-core';
import { handleCheckNewFriend } from '../utils/FriendsUtil';

const uiStore = observable({
  /*
    Resource Type : URL 상의 s / f / m
    충남대의 경우 friend / room /....
  */
  resourceType: null,

  /*
    Tab Type : 선택된 탭 s / f / m
    (탭 이동시에는 url 변경 없어야 하기 때문)
  */
  tabType: null,
  resourceId: null,
  mainApp: 'talk',
  subApp: null,
  subAppState: undefined,
  layout: 'collapse',

  /*
    Mobile Footer visibility
  */
  isFooterVisible() {
    return this.resourceType !== 'profile' && this.resourceType !== 'image';
  },

  /*
    Talk Search Input visibility
  */
  isSearchVisible: false,

  isEstVisible: false,
  isNotificationCenterVisible: false,

  sizes: [42.1176, 57.8824],

  // Common Toast, Message
  isToastVisible: false,
  toastText: '',
  toastTimeout: 1000,
  toastSize: 'medium',
  toastLinks: [],
  toastOnClose: () => { },
  openToast({
    text = '',
    timeout = 1000,
    size = 'medium',
    links = [],
    onClose,
  }) {
    transaction(() => {
      this.toastText = text;
      this.toastTimeout = timeout;
      this.toastSize = size;
      this.toastLinks = links;
      this.toastOnClose = onClose || this.closeToast.bind(this);
      this.isToastVisible = true;
    });
  },
  closeToast() {
    transaction(() => {
      this.isToastVisible = false;
      this.toastText = '';
      this.toastTimeout = 1000;
      this.toastSize = 'medium';
      this.toastLinks = [];
      this.toastOnClose = () => { };
    });
  },
  isMessageVisible: false,
  messageType: '',
  messageTitle: '',
  messageSubTitle: '',
  messageButton: [],
  messageCustomBadge: null,
  openMessage({
    type = '',
    title = '',
    subTitle = '',
    roomInfo = {},
    buttons = [],
    customBadge = null,
    isOpenRoom = false,
  }) {
    transaction(() => {
      this.messageType = type;
      this.messageTitle = title;
      this.messageSubTitle = subTitle;
      this.messageButton = buttons;
      this.messageCustomBadge = customBadge;
      this.isMessageVisible = true;
      this.roomInfo = roomInfo;
      this.isOpenRoom = isOpenRoom;
    });
  },
  closeMessage() {
    transaction(() => {
      this.isMessageVisible = false;
      this.messageType = '';
      this.messageTitle = '';
      this.messageSubTitle = '';
      this.messageButton = [];
      this.messageCustomBadge = null;
      this.roomInfo = {};
      this.isOpenRoom = null;
    });
  },

  // modal
  roomMemberModal: {
    isEdit: false,
    visible: false,
    rect: null,

    open({ top, left, isEdit = false }) {
      this.isEdit = isEdit;
      this.visible = true;
      if (top) {
        this.top = top;
      }
      if (left) {
        this.left = left;
      }
    },

    close() {
      this.visible = false;
    },
  },

  // [TODO] : Talk 안정화 될때까지 임시
  get totalUnreadCount() {
    return RoomStore.getRoomArray(true)
      .filter(roomInfo => roomInfo.isVisible)
      .reduce(
        (accumulator, roomInfo) =>
          accumulator + parseInt(roomInfo.metadata.count ?? '0', 10),
        0,
      );
  },

  get newFriendCount() {
    return FriendStore.friendInfoList?.filter(elem =>
      handleCheckNewFriend(elem),
    ).length;
  },

  // drag and drop
  dnd: {
    roomId: null,
    files: [],
    isVisible: false,
  },

  // ref
  content: {
    rect: null,
  },

  // windows 관련
  talkWindowMap: new Map(),
  meetingWindowMap: new Map(),
  floatBtnVisible: false,

  _getMap(type) {
    switch (type) {
      case 'talk':
        return this.talkWindowMap;
      case 'meeting':
        return this.meetingWindowMap;
      default:
        return null;
    }
  },

  getWindows(type) {
    const targetMap = this._getMap(type);
    if (targetMap) return values(targetMap);
    return null;
  },

  getWindow(type, windowId) {
    const targetMap = this._getMap(type);
    if (targetMap) return targetMap.get(windowId);
    return null;
  },

  openWindow(windowInfo, enableFocus = true) {
    const { id: windowId, type } = windowInfo;
    const targetMap = this._getMap(type);
    const targetWindow = targetMap.get(windowId);

    if (enableFocus && targetWindow) {
      this.focusWindow(type, windowId);
    } else {
      targetMap.set(windowId, windowInfo);
    }
  },

  focusWindow(type, windowId) {
    const handler = this.getWindow(type, windowId)?.handler;

    if (handler && !handler.closed) {
      handler.focus();
    }
  },

  closeWindow(type, windowId) {
    const targetMap = this._getMap(type);
    if (targetMap) {
      const targetWindow = targetMap.get(windowId);
      targetWindow.handler?.close();
      targetMap.delete(windowId);
    }
  },

  closeAllWindow(type) {
    this.getWindows(type).forEach(window => {
      const { id: windowId } = window;
      this.closeWindow(type, windowId);
    });
  },

  get isFloatBtnVisible() {
    return this.floatBtnVisible;
  },

  setFloatBtnVisible(bool) {
    this.floatBtnVisible = bool;
  },

  // profileEmoticon 용 store
  statusCode: 'STA0000',
  get statusText() {
    switch (this.statusCode) {
      case 'STA0001':
        return 'CM_STATUS_ONLINE';
      case 'STA0002':
        return 'CM_STATUS_MISSED';
      case 'STA0003':
        return 'CM_STATUS_VACATION';
      case 'STA0004':
        return 'CM_STATUS_MEETING';
      default:
        return 'CM_STATUS_SET';
    }
  },
  setStatusCode(data) {
    this.statusCode = data;
  },
});

export default uiStore;
