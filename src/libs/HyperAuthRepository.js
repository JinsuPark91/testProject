import axios from 'axios';
import { keycloakConfig } from './keycloak.js';

class HyperAuthRepository {
  /**
   * hyperauth용 자동로그인 여부
   * @param sessionState - keycloak token이 반환하는 session-state 값
   * @return - 자동로그인 체크 여부  'on' || 'off' 둘 중 하나만 쓰임
   * @description 자동로그인을 체크 할 경우 on, 자동로그인을 체크 하지 않을 경우 off 리턴하는 HyperAuth용 서비스입니다.
   */
  async getRememberMe({ sessionState }) {
    try {
      const response = await axios.get(
        `${keycloakConfig.url}/auth/realms/${keycloakConfig.realm}/session/${sessionState}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
export default new HyperAuthRepository();
