import { OrgStore, UserStore, AuthStore } from 'teespace-core';
import moment from 'moment';

export const handleFriendsDialogType = async (orgFunction, noOrgFunction) => {
  const { myProfile } = UserStore;
  const domainKey = AuthStore.sessionInfo?.domainKey;
  const params = {
    orgType: 'ADM0021',
    publicType: 'ADM0011',
    showRootOrg: true,
  }; // 공개 조직만 조회
  try {
    const response = await OrgStore.getOrgTree(params);
    if (response && response.length) {
      orgFunction();
    } else {
      // NOTE. 멤버 목록 조회는 조직이 있건 없건 필요함.
      //  단 이후 페이지네이션을 적용하는 부분은 따로 고려해야 함.
      const useDomainKey =
        process.env.REACT_APP_ENV === 'local' ? domainKey : undefined;
      const res = await OrgStore.getUserOrgUserList(
        myProfile?.companyCode,
        myProfile?.departmentCode,
        myProfile?.id,
        useDomainKey,
      );
      noOrgFunction(res);
    }
  } catch (e) {
    console.log('get OrgUserList Error');
  }
};

export const handleCheckNewFriend = friendInfo => {
  const now = moment();
  const friendRegDate = moment(
    friendInfo.friendRegDate,
    'YYYY-MM-DD HH:mm:ss.S Z',
  );

  return friendRegDate.isValid() && now.diff(friendRegDate, 'minutes') < 60;
};

export default {
  handleFriendsDialogType,
  handleCheckNewFriend,
};
