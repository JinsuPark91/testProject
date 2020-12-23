const FriendsUtil = async (
  currentSpace,
  orgStore,
  myProfile,
  domainKey,
  emptySpaceFunction,
  orgExistFunction,
  noOrgFunction,
) => {
  if (currentSpace && currentSpace.userCount === 1) {
    emptySpaceFunction();
  } else {
    const response = await orgStore.getOrgTree();
    if (response && response.length) {
      orgExistFunction();
    } else {
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
    }
  }
};

export default FriendsUtil;
