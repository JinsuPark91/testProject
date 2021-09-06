import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { useCoreStores, Tabs, WaplSearch, Checkbox, WWMS } from 'teespace-core';
import { Button } from 'antd';
import styled from 'styled-components';
import Moment from 'react-moment';
import { useStores } from '../../../../stores';
import MobileRoomSettingHeader from './MobileRoomSettingHeader';
import MobileRoomEditModal from './MobileRoomEditModal';
import MobileLoader from '../../MobileLoader';
import { LeaderIcon } from '../../../Icons';

const MobileRoomEditMember = ({ roomId }) => {
  const { t } = useTranslation();
  const { roomSettingStore: store, mobileStore, uiStore } = useStores();
  const { userStore, roomStore } = useCoreStores();
  const { TabPane } = Tabs;
  const history = useHistory();
  const location = useLocation();
  const roomInfo = roomStore.getRoom(roomId);

  const [editRoomMemberInfo, setEditRoomMemberInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [isEditRoomModalVisible, setIsEditRoomModalVisible] = useState(false);

  const handleCancel = () => history.push(`/room`);

  useEffect(() => {
    mobileStore.settingKeyName = 'member';
    Promise.all([
      store.fetchMembers({ roomId }),
      store.fetchRequestMembers({ roomId }),
      store.fetchBlockedMembers({ roomId }),
    ]).then(() => {
      mobileStore.settingKeyName = location?.state?.subTab || 'member';
      setLoading(false);
    });
  }, [location, mobileStore, roomId, store]);

  // TODO: 추후 중복 제거
  useEffect(() => {
    const handleSystemMessage = message => {
      if (message.SPACE_ID !== roomInfo.id) return;

      switch (message.NOTI_TYPE) {
        case 'addMember':
        case 'removeMember':
          store.fetchMembers({ roomId: roomInfo.id });
          store.fetchBlockedMembers({ roomId: roomInfo.id });
          break;
        case 'memberRequest':
          store.fetchRequestMembers({ roomId: roomInfo.id });
          break;
        default:
          break;
      }
    };

    WWMS.addHandler('SYSTEM', 'room_setting', handleSystemMessage);

    return () => {
      WWMS.removeHandler('SYSTEM', 'room_setting');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 참여 인원 */
  const handleOpenEditRoomModal = useCallback((e, memberInfo) => {
    e.stopPropagation();
    setEditRoomMemberInfo(memberInfo);
    setIsEditRoomModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditRoomModalVisible(false);
  }, []);

  const handleSelectAllRequest = () => {
    store.requestMembers.forEach(elem => {
      store.selectedRequestMembers.set(elem.id, elem);
    });
  };

  const handleConfirmEnter = async () => {
    const userIdList = Array.from(store.selectedRequestMembers.keys());
    try {
      const result = await store.acceptUsers({
        roomId: roomInfo.id,
        userIdList,
      });
      if (result) {
        await store.fetchRequestMembers({ roomId: roomInfo.id });
        uiStore.openToast({
          text: t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_07', {
            num: store.selectedRequestMembers.size,
          }),
        });
      }
      store.selectedRequestMembers.clear();
    } catch (e) {
      console.log(`Open Room Enter Confirm Error: ${e}`);
    }
  };

  const handleDeclineEnter = async () => {
    const userIdList = Array.from(store.selectedRequestMembers.keys());
    try {
      const result = await store.rejectUsers({
        roomId: roomInfo.id,
        userIdList,
      });
      if (result) {
        await store.fetchRequestMembers({ roomId: roomInfo.id });
        uiStore.openToast({
          text: t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_08', {
            num: store.selectedRequestMembers.size,
          }),
        });
        store.selectedRequestMembers.clear();
      }
    } catch (e) {
      console.log(`Open Room Enter Reject Error: ${e}`);
    }
  };

  const handleSelectAllBan = () => {
    store.banMembers.forEach(elem => {
      store.selectedBanMembers.set(elem.id, elem);
    });
  };

  const handleUnblock = async () => {
    const userIdList = Array.from(store.selectedBanMembers.keys());
    const result = await store.disableBan({ roomId, userIdList });
    if (result) {
      await store.fetchBlockedMembers({ roomId });
      uiStore.openToast({
        text: t('CM_ROOM_SETTING_MANAGE_PEOPLE_04', {
          num: store.selectedBanMembers.size,
        }),
      });
      store.selectedBanMembers.clear();
    }
  };

  if (loading) return <MobileLoader />;

  return (
    <>
      <MobileRoomSettingHeader
        title={t('CM_ROOM_CONTEXTMENU_EXIT_MANAGER_03')}
        handleCancel={handleCancel}
      />
      <EditMemberContentn>
        <Tabs
          defaultActiveKey={mobileStore.settingKeyName}
          onChange={activeKey => {
            mobileStore.settingKeyName = activeKey;
            if (activeKey === 'request') store.selectedRequestMembers.clear();
            else if (activeKey === 'ban') store.selectedBanMembers.clear();
          }}
        >
          <TabPane tab={t('CM_ROOM_SETTING_MANAGE_PEOPLE_01')} key="member">
            {/* <MemberSearch
              type="default"
              placeholder={t('CM_NICKNAME_TEAM_TITLE_SEARCH')}
              // onClear={handleClear}
              // onChange={handleKeywordChange}
              isCountExist={false}
            /> */}
            <MemberUtile>
              <UtileTitle>
                <Observer>
                  {() => (
                    <Trans
                      i18nKey="CM_ROOM_SETTING_MANAGE_PEOPLE_02"
                      components={{
                        style: <TitleCount />,
                      }}
                      values={{ num: roomInfo?.userCount }}
                    />
                  )}
                </Observer>
              </UtileTitle>
              {/* <InviteButton type="solid">+ {t('CM_ROOM_INVITE_USER')}</InviteButton> */}
            </MemberUtile>
            <MemberList>
              <Observer>
                {() =>
                  store.roomMembers.map(memberInfo => (
                    <MemberItem key={memberInfo.id}>
                      <ItemProfile>
                        <Image
                          alt="profile image"
                          src={userStore.getProfilePhotoURL(
                            memberInfo.id,
                            'small',
                          )}
                        />
                        <NameBox>
                          {memberInfo.role === 'WKS0004' && (
                            <MeBadge>{t('CM_FRIENDLIST_04')}</MeBadge>
                          )}
                          <Name>{memberInfo.displayName}</Name>
                          {memberInfo.role === 'WKS0004' && (
                            <LeaderIconWrap>
                              <LeaderIcon
                                width={1}
                                height={1}
                                color="#205855"
                              />
                            </LeaderIconWrap>
                          )}
                          {memberInfo.grade === 'guest' && (
                            <GuestBadge>{t('CM_GUEST')}</GuestBadge>
                          )}
                        </NameBox>
                      </ItemProfile>
                      {memberInfo.role !== 'WKS0004' && (
                        <ItemSub>
                          <Button
                            size="small"
                            onClick={e =>
                              handleOpenEditRoomModal(e, memberInfo)
                            }
                          >
                            {t('TALK_ROOMMENU_MANAGEMEMBERS_PARTICIPANTS_06')}
                          </Button>
                        </ItemSub>
                      )}
                    </MemberItem>
                  ))
                }
              </Observer>
            </MemberList>
          </TabPane>
          <TabPane
            tab={t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_01')}
            key="request"
          >
            {/* <MemberSearch
              type="default"
              placeholder={t('CM_NICKNAME_TEAM_TITLE_SEARCH')}
              isCountExist={false}
            /> */}
            <MemberUtile>
              <UtileTitleBox>
                <UtileTitle>
                  <Observer>
                    {() => (
                      <Trans
                        i18nKey="CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_02"
                        components={{
                          style: <TitleCount />,
                        }}
                        values={{ num: store.requestMembers.length }}
                      />
                    )}
                  </Observer>
                </UtileTitle>
                <UtileTitleSub>
                  {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_06')}
                </UtileTitleSub>
              </UtileTitleBox>
              <TextButton type="link" onClick={handleSelectAllRequest}>
                {t('CM_ROOMLIST_EDIT_02')}
              </TextButton>
            </MemberUtile>
            <MemberList>
              <Observer>
                {() =>
                  store.requestMembers.map(memberInfo => (
                    <MemberItem key={memberInfo.id}>
                      <ItemProfile>
                        <Image
                          alt="profile image"
                          src={userStore.getProfilePhotoURL(
                            memberInfo.id,
                            'small',
                          )}
                        />
                        <NameBox>
                          <Name>{memberInfo.displayName}</Name>
                        </NameBox>
                      </ItemProfile>
                      <ItemSub>
                        <RequestDate>
                          <Moment format="YYYY.MM.DD">
                            {memberInfo.reqRegDate}
                          </Moment>
                        </RequestDate>
                        <Checkbox
                          className="check-round"
                          checked={store.selectedRequestMembers.has(
                            memberInfo.id,
                          )}
                          onChange={event => {
                            if (event.target.checked)
                              store.selectedRequestMembers.set(
                                memberInfo.id,
                                memberInfo,
                              );
                            else
                              store.selectedRequestMembers.delete(
                                memberInfo.id,
                              );
                          }}
                        />
                      </ItemSub>
                    </MemberItem>
                  ))
                }
              </Observer>
            </MemberList>
          </TabPane>
          <TabPane tab={t('CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_01')} key="ban">
            {/* <MemberSearch
              type="default"
              placeholder={t('CM_NICKNAME_TEAM_TITLE_SEARCH')}
              isCountExist={false}
            /> */}
            <MemberUtile>
              <UtileTitle>
                <Observer>
                  {() => (
                    <Trans
                      i18nKey="CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_02"
                      components={{
                        style: <TitleCount />,
                      }}
                      values={{ num: store.banMembers.length }}
                    />
                  )}
                </Observer>
              </UtileTitle>
              <TextButton type="link" onClick={handleSelectAllBan}>
                {t('CM_ROOMLIST_EDIT_02')}
              </TextButton>
            </MemberUtile>
            <MemberList>
              <Observer>
                {() =>
                  store.banMembers.map(memberInfo => (
                    <MemberItem key={memberInfo.id}>
                      <ItemProfile>
                        <Image
                          alt="profile image"
                          src={userStore.getProfilePhotoURL(
                            memberInfo.id,
                            'small',
                          )}
                        />
                        <NameBox>
                          <Name>{memberInfo.displayName}</Name>
                        </NameBox>
                      </ItemProfile>
                      <ItemSub>
                        <Checkbox
                          className="check-round"
                          checked={store.selectedBanMembers.has(memberInfo.id)}
                          onChange={event => {
                            if (event.target.checked)
                              store.selectedBanMembers.set(
                                memberInfo.id,
                                memberInfo,
                              );
                            else store.selectedBanMembers.delete(memberInfo.id);
                          }}
                        />
                      </ItemSub>
                    </MemberItem>
                  ))
                }
              </Observer>
            </MemberList>
          </TabPane>
        </Tabs>
      </EditMemberContentn>
      <Observer>
        {() =>
          // eslint-disable-next-line no-nested-ternary
          mobileStore.settingKeyName ===
          'member' ? null : mobileStore.settingKeyName === 'request' ? (
            <EditMemberFooter>
              <Button
                disabled={store.selectedRequestMembers.size === 0}
                onClick={handleDeclineEnter}
              >
                {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_04')}
              </Button>
              <Button
                type="solid"
                disabled={store.selectedRequestMembers.size === 0}
                onClick={handleConfirmEnter}
              >
                {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_03')}
              </Button>
            </EditMemberFooter>
          ) : (
            <EditMemberFooter>
              <Button
                type="solid"
                disabled={store.selectedBanMembers.size === 0}
                onClick={handleUnblock}
              >
                {t('CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_03')}
              </Button>
            </EditMemberFooter>
          )
        }
      </Observer>
      {isEditRoomModalVisible ? (
        <MobileRoomEditModal
          roomInfo={roomInfo}
          member={editRoomMemberInfo}
          onCancel={handleCloseModal}
        />
      ) : null}
    </>
  );
};

const EditMemberContentn = styled.div`
  .ant-tabs-nav {
    height: 2.5rem;
  }
  .ant-tabs-content-holder {
    padding-top: 0.5rem;
    background-color: #f7f4ef;
  }
  .ant-tabs-content {
    padding: 1rem 1rem 0;
    background-color: #fff;
  }
`;
const MemberSearch = styled(WaplSearch)`
  margin-bottom: 1rem;
`;
const MemberUtile = styled.div`
  display: flex;
  min-height: 2.25rem;
  justify-content: space-between;
  align-items: center;
`;
const UtileTitleBox = styled.div`
  overflow: hidden;
`;
const UtileTitle = styled.p`
  overflow: hidden;
  font-size: 0.75rem;
  line-height: 1.125rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const UtileTitleSub = styled.span`
  display: block;
  font-size: 0.75rem;
  line-height: 1.125rem;
  font-weight: 500;
  color: #666;
`;
const TitleCount = styled.span`
  padding-left: 0.375rem;
  color: #aeaeae;
`;
const InviteButton = styled(Button)`
  height: 2.25rem;
`;
const TextButton = styled(Button)`
  min-width: auto;
  padding: 0;
`;
const MemberList = styled.div`
  margin-top: 0.375rem;
`;
const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;
const ItemProfile = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
`;
const Image = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;
const NameBox = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-left: 0.75rem;
  font-size: 0.813rem;
  font-weight: 500;
`;
const Name = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const ItemSub = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  .ant-checkbox .ant-checkbox-inner {
    width: 1.125rem;
    height: 1.125rem;
  }
`;
const RequestDate = styled.span`
  margin-right: 0.5rem;
  font-size: 0.75rem;
  color: #7b7b7b;
`;
const MeBadge = styled.span`
  margin-right: 0.375rem;
  padding: 0px 0.19rem;
  background-color: #232d3b;
  border-radius: 0.25rem;
  font-size: 0.5rem;
  line-height: 1rem;
  color: #fff;
`;
const GuestBadge = styled.span`
  margin-left: 0.375rem;
  padding: 0px 0.25rem;
  background-color: #f7f4ef;
  border-radius: 0.25rem;
  font-size: 0.5rem;
  line-height: 0.875rem;
  color: #afa397;
`;
const LeaderIconWrap = styled.span`
  margin: -0.125rem 0 0 0.375rem;
  line-height: 0;
`;
const EditMemberFooter = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4.25rem;
  padding: 1rem;
  background-color: #fff;
  .ant-btn {
    flex: 1;
    height: 100%;
    & + .ant-btn {
      margin-left: 0.5rem;
    }
  }
`;

export default MobileRoomEditMember;
