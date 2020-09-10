import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { persist } from 'mobx-persist';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import { ApiResponse } from '../common/API';
import AuthRepo from './repository/AuthRepository';
import AuthModel from './model/AuthModel';

const setLoginIdCookie = (id: string, isSaveIdChecked?: boolean) => {
  if (isSaveIdChecked) {
    // CryptoJS library must be loaded
    const encryptedId = CryptoJS.AES.encrypt(
      id.trim(),
      'be080ffe-88a0-49ee-8b5c-d1a701ebba6c',
    );
    Cookies.setCookie('cshid', encryptedId, 365);
  }
};

class AuthStore {
  isLoggedIn: boolean = false;

  @persist('object') @observable myInfo: AuthModel = null;

  @asyncAction
  async *login({
    id,
    pw,
    isAutoLogin,
    deviceId,
    isSaveIdChecked,
    isLocalLogin,
  }) {
    let userId = null;

    const initialRes = yield AuthRepo.authInitial({
      id,
      pw,
      isAutoLogin,
    });

    if (
      initialRes.data &&
      (initialRes.data.resultCode === 'RST0000' ||
        initialRes.data.resultCode === 'RST0001')
    ) {
      const initialResData = initialRes.data; // Login success block
      // TODO: 로그아웃 했는데도 online 으로 오고 항상 아래 로직 타는 이유 분석

      if (initialResData.resultMsg === 'online') {
        const postprocessRes = yield AuthRepo.authPostprocess({
          id,
          isAutoLogin,
          loginKey: initialResData.loginKey,
          token: initialResData.token,
        });

        const postprocessResData = postprocessRes.data;
        if (postprocessResData && postprocessResData.resultCode !== 'RST0001') {
          return new ApiResponse({
            status: 'rejected',
            error: {
              code: postprocessResData.resultCode,
              message: postprocessResData.resultMsg,
            },
          });
        }
        userId = postprocessResData.userId;
      }
    } else {
      // Login Error block
      return new ApiResponse({
        status: 'rejected',
        error: {
          code: initialRes.data ? initialRes.data.resultCode : '',
          message: initialRes.data ? initialRes.data.resultMsg : '',
        },
      });
    }

    if (isLocalLogin && this.myInfo) {
      return new ApiResponse({
        status: 'fulfilled',
        data: this.myInfo,
      });
    }

    this.isLoggedIn = true;
    setLoginIdCookie(id, isSaveIdChecked);

    const myInfoRes = yield AuthRepo.getMyInfo({ userId });
    if (myInfoRes.status === 'success' && myInfoRes.data) {
      this.myInfo = new AuthModel(myInfoRes.data);

      return new ApiResponse({
        status: 'fulfilled',
        data: this.myInfo,
      });
    }

    return new ApiResponse({
      status: 'rejected',
      error: {
        code: '',
        message: myInfoRes.errMsg,
      },
    });
  }

  async logout() {
    const res = await AuthRepo.logout({
      userId: this.myInfo.userId,
    });
    this.myInfo = null;
    return res;
  }

  async updateMyInfo({ userId, editedInfo }) {
    const res = await AuthRepo.editMyInfo({
      userId,
      editedInfo,
    });

    if (res.status === 'success') {
      const resultData = {};

      for (const [key, value] of Object.entries(editedInfo)) {
        if (res.data && res.data[key] === value) {
          resultData[key] = value;
        }
      }

      this.myInfo.setValues(resultData);
    }
  }

  get getMyInfo() {
    return this.myInfo;
  }

  get isAuthenticated() {
    return !!this.myInfo;
  }
}

export default AuthStore;
