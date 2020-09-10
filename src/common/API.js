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

/**
 * API 요청에 대한 응답을 일관성있게 처리 하기 위한 DTO
 */
export class ApiResponse {
  status = null; /* fulfilled | rejected */

  data = null; /* fulfilled 상태 일 때 얻은 응답 데이터 */

  error = null; /* rejected 상태 일 때 설정된 오류 데이터 */

  constructor({ status = null, data = null, error = null }) {
    this.status = status;
    this.data = data;
    this.error = error;
  }
}
