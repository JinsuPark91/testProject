// @flow
import { observable, action, set } from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class AuthModel {
  @observable
  domain: null;

  @observable
  userId: null;

  @observable
  userName: null;

  @observable
  userLoginId: null;

  @observable
  userType: null;

  @observable
  userNick: null;

  @observable
  email: null;

  @observable
  userJob: null;

  @observable
  userPosition: null;

  @observable
  regiPath: null;

  @observable
  thumbPhoto: null;

  @observable
  userGrade: null;

  @observable
  orgName: null;

  @observable
  backPhoto: null;

  @observable
  useYn: null;

  @observable
  connectionId: null;

  @observable
  resultCode: null;

  @observable
  userPw: null;

  @observable
  ip: null;

  @observable
  loginKey: null;

  @observable
  resultMsg: null;

  @observable
  token: null;

  @observable
  regiDate: null;

  @observable
  modiDate: null;

  @observable
  oauthUuid: null;

  @observable
  recommendCode: null;

  @observable
  recommendMember: null;

  @observable
  companyDomain: null;

  @observable
  accessCount: number | null;

  @observable
  maskingId: null;

  @observable
  authKey: null;

  @observable
  authKeyDate: null;

  @observable
  cookieData: null;

  @observable
  accountLink: null;

  @observable
  reasonCode: null;

  @observable
  reasonDetail: null;

  @observable
  pwNextChangeDate: null;

  @observable
  accessFlag: null;

  @observable
  userPw2: null;

  @observable
  pwChange: null;

  @observable
  accessDenyCode: null;

  @observable
  userPhone: null;

  @observable
  profilePhoto: null;

  @observable
  userAddress: null;

  @observable
  userBirth: null;

  @observable
  profileStatusMsg: null;

  @observable
  userEtc: null;

  @observable
  userAffiliation: null;

  @observable
  userCompanyNum: number | null;

  @observable
  roomId: null;

  @observable
  roomName: null;

  @observable
  roomDescription: null;

  @observable
  roomType: null;

  @observable
  friendId: null;

  @observable
  friendNick: null;

  @observable
  companyName: null;

  @observable
  faxNum: null;

  @observable
  departmentName: null;

  @observable
  userStatus: null;

  @observable
  userAddressDetail: null;

  @observable
  nationalCode: null;

  @observable
  backgroundPhoto: null;

  @observable
  companyCode: null;

  @observable
  serviceType: null;

  @observable
  userFullCompanyJob: null;

  @observable
  value: null;

  constructor(data) {
    this.setValues(data);
  }

  setValues(data) {
    set(this, data);
  }

  @action
  setDomain(data) {
    this.domain = data;
  }

  @action
  setUserId(data) {
    // user UUID
    this.userId = data;
  }

  @action
  setUserName(data) {
    this.userName = data;
  }

  @action
  setUserLoginId(data) {
    this.userLoginId = data;
  }

  @action
  setUserType(data) {
    this.userType = data;
  }

  @action
  setUserNick(data) {
    this.userNick = data;
  }

  @action
  setEmail(data) {
    this.email = data;
  }

  @action
  setUserJob(data) {
    this.userJob = data;
  }

  @action
  setUserPosition(data) {
    this.userPosition = data;
  }

  @action
  setRegiPath(data) {
    this.regiPath = data;
  }

  @action
  setThumbPhoto(data) {
    this.thumbPhoto = data;
  }

  @action
  setUserGrade(data) {
    this.userGrade = data;
  }

  @action
  setOrgName(data) {
    this.orgName = data;
  }

  @action
  setBackPhoto(data) {
    this.backPhoto = data;
  }

  @action
  setUseYn(data) {
    this.useYn = data;
  }

  @action
  setConnectionId(data) {
    this.connectionId = data;
  }

  @action
  setResultCode(data) {
    this.resultCode = data;
  }

  @action
  setUserPw(data) {
    this.userPw = data;
  }

  @action
  setIp(data) {
    this.ip = data;
  }

  @action
  setLoginKey(data) {
    this.loginKey = data;
  }

  @action
  setResultMsg(data) {
    this.resultMsg = data;
  }

  @action
  setToken(data) {
    this.token = data;
  }

  @action
  setRegiDate(data) {
    this.regiDate = data;
  }

  @action
  setModiDate(data) {
    this.modiDate = data;
  }

  @action
  setOauthUuid(data) {
    this.oauthUuid = data;
  }

  @action
  setRecommendCode(data) {
    this.recommendCode = data;
  }

  @action
  setRecommendMember(data) {
    this.recommendMember = data;
  }

  @action
  setCompanyDomain(data) {
    this.companyDomain = data;
  }

  @action
  setAccessCount(data: number) {
    this.accessCount = data;
  }

  @action
  setMaskingId(data) {
    this.maskingId = data;
  }

  @action
  setAuthKey(data) {
    this.authKey = data;
  }

  @action
  setAuthKeyDate(data) {
    this.authKeyDate = data;
  }

  @action
  setCookieData(data) {
    this.cookieData = data;
  }

  @action
  setAccountLink(data) {
    this.accountLink = data;
  }

  @action
  setReasonCode(data) {
    this.reasonCode = data;
  }

  @action
  setReasonDetail(data) {
    this.reasonDetail = data;
  }

  @action
  setPwNextChangeDate(data) {
    this.pwNextChangeDate = data;
  }

  @action
  setAccessFlag(data) {
    this.accessFlag = data;
  }

  @action
  setUserPw2(data) {
    this.userPw2 = data;
  }

  @action
  setPwChange(data) {
    this.pwChange = data;
  }

  @action
  setAccessDenyCode(data) {
    this.accessDenyCode = data;
  }

  @action
  setUserPhone(data) {
    this.userPhone = data;
  }

  @action
  setProfilePhoto(data) {
    this.profilePhoto = data;
  }

  @action
  setUserAddress(data) {
    this.userAddress = data;
  }

  @action
  setUserBirth(data) {
    this.userBirth = data;
  }

  @action
  setProfileStatusMsg(data) {
    this.profileStatusMsg = data;
  }

  @action
  setUserEtc(data) {
    this.userEtc = data;
  }

  @action
  setUserAffiliation(data) {
    this.userAffiliation = data;
  }

  @action
  setUserCompanyNum(data: number) {
    this.userCompanyNum = data;
  }

  @action
  setRoomId(data) {
    this.roomId = data;
  }

  @action
  setRoomName(data) {
    this.roomName = data;
  }

  @action
  setRoomDescription(data) {
    this.roomDescription = data;
  }

  @action
  setRoomType(data) {
    this.roomType = data;
  }

  @action
  setFriendId(data) {
    this.friendId = data;
  }

  @action
  setFriendNick(data) {
    this.friendNick = data;
  }

  @action
  setCompanyName(data) {
    this.companyName = data;
  }

  @action
  setFaxNum(data) {
    this.faxNum = data;
  }

  @action
  setDepartmentName(data) {
    this.departmentName = data;
  }

  @action
  setUserStatus(data) {
    this.userStatus = data;
  }

  @action
  setUserAddressDetail(data) {
    this.userAddressDetail = data;
  }

  @action
  setNationalCode(data) {
    this.nationalCode = data;
  }

  @action
  setBackgroundPhoto(data) {
    this.backgroundPhoto = data;
  }

  @action
  setCompanyCode(data) {
    this.companyCode = data;
  }

  @action
  setServiceType(data) {
    this.serviceType = data;
  }

  @action
  setUserFullCompanyJob(data) {
    this.userFullCompanyJob = data;
  }

  @action
  setValue(data) {
    this.value = data;
  }
}

export default AuthModel;

export const myInfoObj = {
  userId: null,
  userName: null,
  userNick: null,
  userGrade: null,
  userType: null,
  regiPath: null,
  email: null,
  orgName: null,
  userPosition: null,
  userJob: null,
  thumbPhoto: null,
  userLoginId: null,
  backPhoto: null,
  useYn: null,
  domain: null,
  setOrgName: null,
  connectionId: null,
  resultCode: null,
  userPw: null,
  ip: null,
  loginKey: null,
  resultMsg: null,
  token: null,
  regiDate: null,
  modiDate: null,
  oauthUuid: null,
  recommendCode: null,
  recommendMember: null,
  companyDomain: null,
  accessCount: null,
  maskingId: null,
  authKey: null,
  authKeyDate: null,
  cookieData: null,
  accountLink: null,
  reasonCode: null,
  reasonDetail: null,
  pwNextChangeDate: null,
  accessFlag: null,
  userPw2: null,
  pwChange: null,
  accessDenyCode: null,
  userPhone: null,
  profilePhoto: null,
  userAddress: null,
  userBirth: null,
  profileStatusMsg: null,
  userEtc: null,
  userAffiliation: null,
  userCompanyNum: null,
  roomId: null,
  roomName: null,
  roomDescription: null,
  roomType: null,
  friendId: null,
  friendNick: null,
  companyName: null,
  faxNum: null,
  departmentName: null,
  userStatus: null,
  userAddressDetail: null,
  nationalCode: null,
  backgroundPhoto: null,
  companyCode: null,
  serviceType: null,
  userFullCompanyJob: null,
  value: null,
  oldPw: null,
};

export const myInfoObjDto = {
  USER_ID: null,
  USER_PW: null,
  USER_NAME: null,
  USER_NICK: null,
  REGI_DATE: null,
  MODI_DATE: null,
  USER_LOGIN_ID: null,
  OAUTH_UUID: null,
  TOKEN: null,
  USER_TYPE: null,
  MEM_GRADE: null,
  USE_YN: null,
  RESULT_CD: null,
  RESULT_MSG: null,
  LOGIN_KEY: null,
  REGI_PATH: null,
  RECOMMEND_CODE: null,
  RECOMMEND_MEM: null,
  CONNECTION_ID: null,
  COMPANY_DOMAIN: null,
  MASKING_ID: null,
  IP_ADDRESS: null,
  AUTH_KEY: null,
  AUTH_KEY_DATE: null,
  COOKIE_DATA: null,
  ACCOUNT_LINK: null,
  ACCESS_DENY_CODE: null,
  PW_CHANGE: null,
  USER_PW2: null,
  ACCESS_FLAG: null,
  ACCESS_CNT: null,
  USER_DOMAIN: null,
  USER_EMAIL: null,
  ORG_NAME: null,
  USER_POSITION: null,
  USER_JOB: null,
  THUMB_PHOTO: null,
  BACKGROUND_THUMB: null,
  REASON_CODE: null,
  REASON_DETAIL: null,
  PW_NEXT_CHANGE_DATE: null,
  PROFILE_PHOTO: null,
  USER_ADDRESS: null,
  USER_BIRTH: null,
  PROFILE_STATUS_MSG: null,
  USER_ETC: null,
  USER_AFF: null,
  WS_ID: null,
  WS_NAME: null,
  WS_DESC: null,
  WS_TYPE: null,
  FRIEND_ID: null,
  FRIEND_NICK: null,
  COMPANY_NAME: null,
  FAX_NUM: null,
  DEPARTMENT_NAME: null,
  USER_STATUS: null,
  USER_ADDRESS_DETAIL: null,
  NATIONAL_CODE: null,
  BACKGROUND_PHOTO: null,
  COMPANY_CODE: null,
  SERVICE_TYPE: null,
  USER_FULL_COM_JOB: null,
  VALUE: null,
  OLD_PW: null,
};
