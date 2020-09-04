import axios from 'axios';
import Config from '../config';

function API() {}

API.prototype = {
  $instance: null,
  get instance() {
    if (this.$instance === null) {
      this.$instance = axios.create({
        baseURL: `${Config.serviceURL}`,
      });
    }
    return this.$instance;
  },
  async Get(url, params) {
    return this.instance.get(url, params ? { params } : undefined);
  },
  async Post(url, params) {
    return this.instance.post(url, params || undefined);
  },
  async Put(url, params) {
    return this.instance.put(url, params || undefined);
  },
  async Delete(url, params) {
    return this.instance.delete(url, params ? { params } : undefined);
  },
};

export default new API();
