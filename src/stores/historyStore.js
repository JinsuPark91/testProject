/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
import { observable } from 'mobx';
import { UserStore } from 'teespace-core';

const HistoryStore = observable({
  histories: [],

  async fetchHistories() {
    try {
      const userId = UserStore.myProfile.id;
      this.histories = await UserStore.getRoutingHistory({
        userId,
      });

      return Promise.resolve(this.histories);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async fetchHistory({ roomId }) {
    try {
      const userId = UserStore.myProfile.id;
      const history = await UserStore.getRoutingHistory({
        userId,
        roomId,
      });

      return Promise.resolve(history);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  updateHistory({ history }) {
    const { roomId } = history;

    const index = this.histories.findIndex(
      _history => _history.roomId === roomId,
    );
    if (index !== -1) {
      this.histories[index] = history;
    }
  },

  get lastHistory() {
    if (this.histories.length) {
      return this.histories[0];
    }

    return null;
  },

  async getHistory({ roomId }) {
    try {
      let history = this.histories.find(_history => _history.roomId === roomId);
      if (!history) {
        history = await this.fetchHistory({ roomId });
      }

      return Promise.resolve(history);
    } catch (err) {
      return Promise.reject(err);
    }
  },
});

export default HistoryStore;
