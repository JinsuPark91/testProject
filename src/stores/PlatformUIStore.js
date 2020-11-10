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

  selectedRoom: null,

  get roomName() {
    if (this.resourceType === 's') {
      if (this.selectedRoom?.name) return this.selectedRoom.name;
      return '이름 없음';
    }
    return null;
  },
});

export default PlatformUIStore;
