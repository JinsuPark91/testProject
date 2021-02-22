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

// 휴대폰 번호 얻기
export const getMobileNumber = (profile, isMobile = true) => {
  const nCode = profile?.nationalCode || '';
  let number = isMobile ? profile?.phone : profile?.companyNum;
  if (!number) return '-';

  // 010 - 1234 - 5678
  let firstNum = ''; // 010
  let secondNum = ''; // 1234
  let thirdNum = ''; // 5678

  if (number.length <= 10) {
    firstNum = nCode ? number.substring(1, 3) : number.substring(0, 3);
    secondNum = number.substring(3, 6) ? `-${number.substring(3, 6)}` : '';
    thirdNum = number.substring(6) ? `-${number.substring(6)}` : '';
  } else if (number.length === 11) {
    firstNum = nCode ? number.substring(1, 3) : number.substring(0, 3);
    secondNum = `-${number.substring(3, 7)}`;
    thirdNum = `-${number.substring(7)}`;
  } else if (number.length >= 12 && nCode) {
    number = number.substring(1);
  }

  if (firstNum) number = firstNum + secondNum + thirdNum;
  return `${nCode} ${number}`;
};

// 회사 번호 얻기
export const getCompanyNumber = profile => {
  const nCode = profile?.nationalCode || '';
  let number = profile?.companyNum;
  if (!number) return '-';

  let firstNum = '';
  let secondNum = '';
  let thirdNum = '';

  if (number.substring(0, 2) === '02') {
    if (number.length <= 9) {
      firstNum = nCode ? '2' : '02';
      secondNum = number.substring(2, 5) ? `-${number.substring(2, 5)}` : '';
      thirdNum = number.substring(5) ? `-${number.substring(5)}` : '';
    } else if (number.length === 10) {
      firstNum = nCode ? '2' : '02';
      secondNum = `-${number.substring(2, 6)}`;
      thirdNum = `-${number.substring(6)}`;
    } else if (number.length >= 11 && nCode) {
      number = number.substring(1);
    }

    if (firstNum) number = firstNum + secondNum + thirdNum;
    return `${nCode} ${number}`;
  }

  // 지역번호가 02가 아니면 모바일 번호 양식이랑 기획이 같음
  return getMobileNumber(profile, false);
};
