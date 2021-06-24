import { RoomStore, UserStore } from 'teespace-core';

export const handleProfileMenuClick = async (
  myUserId,
  targetUserId,
  handleVisibleRoom,
  handleNoRoom,
) => {
  const { roomInfo } = RoomStore.getDMRoom(myUserId, targetUserId);
  // 이미 룸리스트에 있는 경우
  try {
    if (roomInfo && roomInfo.isVisible) {
      await handleVisibleRoom(roomInfo);
      return;
    }
    // 방은 있지만 룸리스트에 없는 경우 (나간경우)
    if (roomInfo && !roomInfo.isVisible) {
      await RoomStore.activateRoom({ roomId: roomInfo.id });
      handleNoRoom(roomInfo);
      return;
    }
    // 아예 방이 없는 경우 (한번도 대화한적이 없음)
    await RoomStore.createRoom({
      creatorId: myUserId,
      userList: [{ userId: targetUserId }],
    });
    const newRoomInfo = RoomStore.getDMRoom(myUserId, targetUserId)?.roomInfo;
    handleNoRoom(newRoomInfo);
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
  if (!number || number === 'undefined') return '-';

  // 010 - 1234 - 5678
  let firstNum = ''; // 010
  let secondNum = ''; // 1234
  let thirdNum = ''; // 5678

  if (number.length >= 6 && number.length <= 10) {
    firstNum =
      nCode && number.substring(0, 1) === '0'
        ? number.substring(1, 3)
        : number.substring(0, 3);
    secondNum = number.substring(3, 6) ? `-${number.substring(3, 6)}` : '';
    thirdNum = number.substring(6) ? `-${number.substring(6)}` : '';
  } else if (number.length === 11) {
    firstNum =
      nCode && number.substring(0, 1) === '0'
        ? number.substring(1, 3)
        : number.substring(0, 3);
    secondNum = `-${number.substring(3, 7)}`;
    thirdNum = `-${number.substring(7)}`;
  } else if (nCode) {
    number = number.substring(0, 1) === '0' ? number.substring(1) : number;
  }

  if (firstNum) number = firstNum + secondNum + thirdNum;
  return `${nCode} ${number}`;
};

// 회사 번호 얻기
export const getCompanyNumber = profile => {
  const nCode = profile?.nationalCode || '';
  let number = profile?.companyNum;
  if (!number || number === 'undefined') return '-';

  let firstNum = '';
  let secondNum = '';
  let thirdNum = '';

  if (number.substring(0, 2) === '02') {
    if (number.length >= 6 && number.length <= 9) {
      firstNum = nCode ? '2' : '02';
      secondNum = number.substring(2, 5) ? `-${number.substring(2, 5)}` : '';
      thirdNum = number.substring(5) ? `-${number.substring(5)}` : '';
    } else if (number.length === 10) {
      firstNum = nCode ? '2' : '02';
      secondNum = `-${number.substring(2, 6)}`;
      thirdNum = `-${number.substring(6)}`;
    } else if (nCode) {
      number = number.substring(1);
    }

    if (firstNum) number = firstNum + secondNum + thirdNum;
    return `${nCode} ${number}`;
  }

  // 지역번호가 02가 아니면 모바일 번호 양식이랑 기획이 같음
  return getMobileNumber(profile, false);
};

export const getFileExtension = file => {
  const fileName = file.name;
  const fileNameLength = fileName.length;
  const fileLastDot = fileName.lastIndexOf('.') + 1;
  const fileExtension = fileName
    .substring(fileLastDot, fileNameLength)
    .toLowerCase();

  return fileExtension;
};

export const updateMyProfile = async info => {
  const { myProfile } = UserStore;
  const {
    thumbFile,
    backgroundFile,
    name,
    nick,
    nationalCode,
    companyNum,
    phone,
    birthDate,
    profileStatusMsg,
  } = info;
  // legacy
  // 기본 이미지로 변경 profilePhoto, profileFile, profileName = null
  // 이미지 변경 없을 시 profileFile, profileName = null, profilePhoto = 경로
  // 이미지 변경시 profilePhoto = null, ProfileFile = fileChooser file, ProfileName = 파일 이름
  //
  let params;
  let file;
  let extension;
  if (thumbFile !== undefined) {
    if (thumbFile) {
      file = thumbFile;
      extension = getFileExtension(thumbFile);
    } else if (thumbFile === null) {
      file = null;
      extension = 'default';
    }
    params = { type: 'profile', extension, file };
    await UserStore.updateMyPhoto(params);
  }

  if (backgroundFile !== undefined) {
    if (backgroundFile) {
      file = backgroundFile;
      extension = getFileExtension(backgroundFile);
    } else if (backgroundFile === null) {
      file = null;
      extension = 'default';
    }
    params = { type: 'background', extension, file };
    await UserStore.updateMyPhoto(params);
  }

  const updatedInfo = {};

  updatedInfo.name = name ?? myProfile.name;
  // 기획상 별명 빈칸으로 변경 시도하면 이름으로 변경되어야 함
  if (nick === undefined) updatedInfo.nick = myProfile.displayName;
  else if (nick === '') updatedInfo.nick = myProfile.name;
  else updatedInfo.nick = nick;

  updatedInfo.nationalCode = nationalCode ?? myProfile.nationalCode;
  updatedInfo.companyNum = companyNum ?? myProfile.companyNum;
  updatedInfo.phone = phone ?? myProfile.phone;
  updatedInfo.birthDate = birthDate ?? myProfile.birthDate;
  updatedInfo.profileStatusMsg = profileStatusMsg ?? myProfile.profileStatusMsg;

  await UserStore.updateMyProfile(updatedInfo);
};
