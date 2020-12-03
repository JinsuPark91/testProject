import { observable } from 'mobx';

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
  layout: 'collapse',

  // modal
  roomMemberModal: {
    visible: false,
    rect: null,

    open({ top, left }) {
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

  // ref
  content: {
    rect: null,
  },
});

export default PlatformUIStore;
