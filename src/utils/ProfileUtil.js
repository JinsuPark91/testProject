// 프로필에서 1:1 Talk, 1:1 Meeting, Mini Talk Open 할 때
export const handleProfileMenuClick = async (
  roomStore,
  myUserId,
  targetUserId,
  visibleRoomFunction,
  hiddenRoomFunction,
  noRoomFunction,
) => {
  const { roomInfo } = roomStore.getDMRoom(myUserId, targetUserId);
  // 이미 룸리스트에 있는 경우
  try {
    if (roomInfo && roomInfo.isVisible) {
      visibleRoomFunction(roomInfo);
      return;
    }
    // 방은 있지만 룸리스트에 없는 경우 (나간경우)
    if (roomInfo && !roomInfo.isVisible) {
      await roomStore.updateRoomMemberSetting({
        roomId: roomInfo.id,
        myUserId,
        newIsVisible: true,
      });
      hiddenRoomFunction(roomInfo);
      return;
    }
    // 아예 방이 없는 경우 (한번도 대화한적이 없음)
    await roomStore.createRoom({
      creatorId: myUserId,
      userList: [{ userId: targetUserId }],
    });
    const newRoomInfo = roomStore.getDMRoom(myUserId, targetUserId)?.roomInfo;
    noRoomFunction(newRoomInfo);
  } catch (e) {
    console.error(`Error is${e}`);
  }
};

// 프로필 사진 파일 관련
export const toBase64 = async blobImage =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blobImage);
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
  });

export const toBlob = async file => {
  const result = await fetch(file).then(r => r.blob());
  return result;
};
