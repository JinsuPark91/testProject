/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import SHA512 from 'js-sha512';
import API from '../../common/API';

class AuthRepository {
  async autoLogin({ deviceId }) {
    const queryObj = {
      dto: {},
    };

    try {
      const response = await API.Post('Users/Auto?action=Login', queryObj);
      return getResult({
        status: 'success',
        data: reformObjFromDto(response.data),
      });
    } catch (error) {
      return getResult({
        status: 'fail',
        errMsg: error.message,
      });
    }
  }

  async logout({ userId, deviceId }) {
    const queryObj = {
      dto: {},
    };
    queryObj.dto.USER_ID = userId;

    try {
      const response = await API.Delete('Users/Logout', queryObj);
      return getResult({
        status: 'success',
        data: reformObjFromDto(response.data),
      });
    } catch (error) {
      return getResult({
        status: 'fail',
        errMsg: error.message,
      });
    }
  }

  async authInitial({ id, pw, isAutoLogin, deviceId }) {
    const queryObj = {
      dto: {
        USER_LOGIN_ID: id.trim(),
        USER_PW: SHA512(pw ? pw.trim() : ''),
        REGI_DATE: isAutoLogin ? 'y' : 'n',
        ...(deviceId && {
          MODI_DATE: deviceId,
        }),
      },
    };

    try {
      const response = await API.Post('Users/PreUser?action=Auth', queryObj);
      return getResult({
        status: 'success',
        data: reformObjFromDto(response.data.dto),
      });
    } catch (error) {
      return getResult({
        status: 'fail',
        errMsg: error.message,
      });
    }
  } // Only runs when the user is already logged in in a different place

  async authPostprocess({ id, isAutoLogin, loginKey, token }) {
    const queryObj = {
      dto: {
        USER_LOGIN_ID: id,
        LOGIN_KEY: loginKey,
        REGI_DATE: isAutoLogin ? 'y' : 'n',
        TOKEN: token,
      },
    };

    try {
      const response = await API.Post('Users/PostUser?action=Auth', queryObj);
      return getResult({
        status: 'success',
        data: reformObjFromDto(response.data.dto),
      });
    } catch (error) {
      return getResult({
        status: 'fail',
        errMsg: error.message,
      });
    }
  }

  async getMyInfo({ deviceId, userId }) {
    const queryObj = {
      dto: {
        USER_ID: userId,
      },
    };

    try {
      const response = await API.Post('Users/BothProfile?action=Get', queryObj);
      return getResult({
        status: 'success',
        data: reformObjFromDto(response.data.dto),
      });
    } catch (error) {
      return getResult({
        status: 'fail',
        errMsg: error.message,
      });
    }
  }

  async editMyInfo({ userId, editedInfo }) {
    const queryObj = {
      dto: {},
    };

    for (const [key, value] of Object.entries(editedInfo)) {
      queryObj.dto[convertUserInfoToInfoDto(key)] = value;
    }

    queryObj.dto.USER_ID = userId;

    try {
      const response = await API.Put('Users/BothProfile?action=Put', queryObj);
      return getResult({
        status: 'success',
        data: reformObjFromDto(response),
      });
    } catch (error) {
      return getResult({
        status: 'fail',
        errMsg: error.message,
      });
    }
  } // TODO: UserAlarmSet Api call 추가 해야함
}

export default new AuthRepository();

function reformObjFromDto(dtoRes) {
  return getUserInfoObjFromInfoDto(dtoRes);
}

const getUserInfoObjFromInfoDto = userInfoDto => {
  const result = {};

  for (const [key, value] of Object.entries(userInfoDto)) {
    result[convertUserInfoDtoToInfo(key)] = value;
  }

  return result;
};

const convertUserInfoDtoToInfo = userInfoDto => {
  switch (userInfoDto) {
    case 'USER_ID':
      return 'userId';
    case 'USER_DOMAIN':
      return 'domain';
    case 'USER_NAME':
      return 'userName';
    case 'USER_LOGIN_ID':
      return 'userLoginId';
    case 'USER_TYPE':
      return 'userType';
    case 'USER_NICK':
      return 'userNick';
    case 'USER_EMAIL':
      return 'email';
    case 'USER_JOB':
      return 'userJob';
    case 'USER_POSITION':
      return 'userPosition';
    case 'REGI_PATH':
      return 'regiPath';
    case 'THUMB_PHOTO':
      return 'thumbPhoto';
    case 'MEM_GRADE':
      return 'userGrade';
    case 'ORG_NAME':
      return 'orgName';
    case 'BACKGROUND_THUMB':
      return 'backPhoto';
    case 'USE_YN':
      return 'useYn';
    case 'CONNECTION_ID':
      return 'connectionId';
    case 'RESULT_CD':
      return 'resultCode';
    case 'USER_PW':
      return 'userPw';
    case 'IP_ADDRESS':
      return 'ip';
    case 'LOGIN_KEY':
      return 'loginKey';
    case 'RESULT_MSG':
      return 'resultMsg';
    case 'TOKEN':
      return 'token';
    case 'KEY':
      return 'key';
    case 'REGI_DATE':
      return 'regiDate';
    case 'MODI_DATE':
      return 'modiDate';
    case 'OAUTH_UUID':
      return 'oauthUuid';
    case 'RECOMMEND_CODE':
      return 'recommendCode';
    case 'RECOMMEND_MEM':
      return 'recommendMember';
    case 'COMPANY_DOMAIN':
      return 'companyDomain';
    case 'ACCESS_CNT':
      return 'accessCount';
    case 'MASKING_ID':
      return 'maskingId';
    case 'AUTH_KEY':
      return 'authKey';
    case 'AUTH_KEY_DATE':
      return 'authKeyDate';
    case 'COOKIE_DATA':
      return 'cookieData';
    case 'ACCOUNT_LINK':
      return 'accountLink';
    case 'ACCESS_DENY_CODE':
      return 'accessDenyCode';
    case 'PW_CHANGE':
      return 'pwChange';
    case 'USER_PW2':
      return 'userPw2';
    case 'ACCESS_FLAG':
      return 'accessFlag';
    case 'REASON_CODE':
      return 'reasonCode';
    case 'REASON_DETAIL':
      return 'reasonDetail';
    case 'PW_NEXT_CHANGE_DATE':
      return 'pwNextChangeDate';
    case 'USER_PHONE':
      return 'userPhone';
    case 'PROFILE_PHOTO':
      return 'profilePhoto';
    case 'USER_ADDRESS':
      return 'userAddress';
    case 'USER_BIRTH':
      return 'userBirth';
    case 'PROFILE_STATUS_MSG':
      return 'profileStatusMsg';
    case 'USER_ETC':
      return 'userEtc';
    case 'USER_AFF':
      return 'userAffiliation';
    case 'USER_COM_NUM':
      return 'userCompanyNum';
    case 'WS_ID':
      return 'roomID';
    case 'WS_NAME':
      return 'roomName';
    case 'WS_DESC':
      // Legacy
      return 'roomDescription';
    case 'WS_TYPE':
      return 'roomType';
    case 'FRIEND_ID':
      return 'friendId';
    case 'FRIEND_NICK':
      return 'friendNick';
    case 'COMPANY_NAME':
      return 'companyName';
    case 'FAX_NUM':
      return 'faxNum';
    case 'DEPARTMENT_NAME':
      return 'departmentName';
    case 'DEPARTMENT_CODE':
      return 'departmentCode';
    case 'FRIEND_RELATION':
      return 'friendRelation';
    case 'ORG_PATH':
      return 'orgPath';
    case 'USER_STATUS':
      return 'userStatus';
    case 'USER_ADDRESS_DETAIL':
      return 'userAddressDetail';
    case 'NATIONAL_CODE':
      return 'nationalCode';
    case 'BACKGROUND_PHOTO':
      return 'backgroundPhoto';
    case 'COMPANY_CODE':
      return 'companyCode';
    case 'SERVICE_TYPE':
      return 'serviceType';
    case 'USER_FULL_COM_JOB':
      return 'userFullCompanyJob';
    case 'VALUE':
      return 'value';
    case 'OLD_PW':
      return 'oldPw';
    default:
      break;
  }

  throw Error(`Invalid parameter: ${userInfoDto}`);
};

const convertUserInfoToInfoDto = userInfo => {
  switch (userInfo) {
    case 'domain':
      return 'USER_DOMAIN';
    case 'userName':
      return 'USER_NAME';
    case 'userLoginId':
      return 'USER_LOGIN_ID';
    case 'userType':
      return 'USER_TYPE';
    case 'userNick':
      return 'USER_NICK';
    case 'email':
      return 'USER_EMAIL';
    case 'userJob':
      return 'USER_JOB';
    case 'userPosition':
      return 'USER_POSITION';
    case 'regiPath':
      return 'REGI_PATH';
    case 'thumbPhoto':
      return 'THUMB_PHOTO';
    case 'userGrade':
      return 'MEM_GRADE';
    case 'orgName':
      return 'ORG_NAME';
    case 'backPhoto':
      return 'BACKGROUND_THUMB';
    case 'useYn':
      return 'USE_YN';
    case 'userPhone':
      return 'USER_PHONE';
    default:
      break;
  }

  throw Error(`Invalid parameter: ${userInfo}`);
};

const getResult = ({ status, errMsg, data }) => ({
  status,
  errMsg,
  data,
});
