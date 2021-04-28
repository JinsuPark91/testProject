/* eslint-disable no-underscore-dangle */
import { observable, values } from 'mobx';
import theme from '../theme';

const uiStore = observable({
  theme: theme.white,

  setTheme(name) {
    if (theme[name]) this.theme = theme[name];
  },

  getTheme() {
    return this.theme.name;
  },

  /*
    Resource Type : URL 상의 s / f / m
    충남대의 경우 friend / room /....
  */
  resourceType: null,

  /*
    FIXME: 추후 좋은 방법 고민, 프로필 수정 모드도 history로 관리?
    모바일 웹뷰용 프로필 수정 모드 판단
  */
  isProfileEditMode: false,

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
  talkWindowMap: new Map(),
  meetingWindowMap: new Map(),

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
});

export default uiStore;
