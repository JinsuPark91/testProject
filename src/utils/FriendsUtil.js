import moment from 'moment';

export const handleFriendsDialogType = async (
  orgStore,
  myProfile,
  domainKey,
  orgFunction,
  noOrgFunction,
) => {
  const params = { orgType: 'ADM0021', publicType: 'ADM0011' }; // 공개 조직만 조회
  const response = await orgStore.getOrgTree(params);
  if (response && response.length) {
    orgFunction();
  }

  // NOTE. 멤버 목록 조회는 조직이 있건 없건 필요함.
  //  단 이후 페이지네이션을 적용하는 부분은 따로 고려해야 함.
  try {
    const useDomainKey =
      process.env.REACT_APP_ENV === 'local' ? domainKey : undefined;
    const res = await orgStore.getUserOrgUserList(
      myProfile?.companyCode,
      myProfile?.departmentCode,
      myProfile?.id,
      useDomainKey,
    );
    noOrgFunction(res);
  } catch (e) {
    console.log('getUserList Error');
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
