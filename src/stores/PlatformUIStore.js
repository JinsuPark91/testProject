/* eslint-disable no-underscore-dangle */
import { observable, values } from 'mobx';

const PlatformUIStore = observable({
  /*
    Resource Type : URL 상의 s / f / m
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
    Talk Search Input visibility
  */
  isSearchVisible: false,

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
  totalUnreadCount: 0,

  // ref
  content: {
    rect: null,
  },

  // windows 관련
  windowMap: new Map(),

  get windows() {
    return values(this.windowMap);
  },

  getWindow(roomId) {
    return this.windowMap.get(roomId);
  },

  openWindow(windowInfo) {
    const { id: windowId } = windowInfo;
    this.windowMap.set(windowId, windowInfo);
  },

  focusWindow(windowId) {
    const handler = this.getWindow(windowId)?.handler;

    if (handler && !handler.closed) {
      handler.focus();
    }
  },

  closeWindow(windowId) {
    this.windowMap.delete(windowId);
  },

  closeAllWindow() {
    this.windows.forEach(window => {
      const { id: windowId } = window;
      this.windowMap.delete(windowId);
    });
  },
});

export default PlatformUIStore;
