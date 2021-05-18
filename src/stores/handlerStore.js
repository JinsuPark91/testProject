/* eslint-disable no-underscore-dangle */
import { action, observable } from 'mobx';

const dummyFn = () => {};
const handlerStore = observable(
  {
    _handlerMap: new Map(),
    _getKey: (commands, roomId) => `${commands}-${roomId}`,

    register(command, roomId, handler) {
      this._handlerMap.set(this._getKey(command, roomId), handler);
    },
    unregister(command, roomId = '') {
      this._handlerMap.delete(this._getKey(command, roomId));
    },
    getHandler(command, roomId = '') {
      const handler = this._handlerMap.get(this._getKey(command, roomId));

      return handler || dummyFn;
    },
  },
  {
    register: action.bound,
  },
);

export default handlerStore;
