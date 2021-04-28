import { observable } from 'mobx';
import { UserStore } from 'teespace-core';

const HistoryStore = observable({
  histories: new Map(),

  async fetchHistories() {
    const result = await UserStore.getRoutingHistory({
      userId: UserStore.myProfile.id,
    });
    console.log('***** Result : ', result);
  },
});

export default HistoryStore;
