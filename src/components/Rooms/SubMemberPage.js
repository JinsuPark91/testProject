import React, { useEffect, useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Message, WaplSearch, useCoreStores, Tooltip } from 'teespace-core';
import styled, { ThemeContext } from 'styled-components';
import { Observer } from 'mobx-react';
import { Button, Checkbox } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { LeaderIcon } from '../Icons';
import RoomAddMemberModal from './RoomAddMemberModal';
import { useStores } from '../../stores';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const WIDTH = {
  CHECKBOX: 5,
  NICK: 10,
  LOGIN_ID: 20,
  TEAM: 10,
  JOB: 10,
  PHONE: 15,
  ROLE: 15,
  BUTTON: 15,
};

const TableRow = ({ style, member, isB2C }) => {
  const { roomSettingStore: store } = useStores();
  const { t } = useTranslation();
  const isAdmin = () => member.role === 'WKS0004';

  const handleTransfer = () => {
    store.targetMember = member;
    store.open('transfer');
  };

  const handleCheckChange = e => {
    if (e.target.checked) {
      store.selectedRoomMembers.set(member.id, member);
    } else {
      store.selectedRoomMembers.delete(member.id);
    }
  };

  const themeContext = useContext(ThemeContext);

  const getMemberType = () => {
    switch (member.grade) {
      case 'member':
        return t('CM_USERS');
      case 'admin':
        return t('CM_ADMIN');
      case 'guest':
        return t('CM_GUEST');
      default:
        return '';
    }
  };

  if (!member) return null;

  return (
    <RowWrapper style={style}>
      <Cell style={{ width: `${WIDTH.CHECKBOX}%` }}>
        {isAdmin() ? (
          <Tooltip
            placement="bottom"
            title={t('CM_ROOM_ADMIN')}
            color={themeContext.CoreLight}
          >
            <IconWrapper>
              <LeaderIcon width={1.13} height={1.13} color="#205855" />
            </IconWrapper>
          </Tooltip>
        ) : (
          <Observer>
            {() => (
              <Checkbox
                className="check-round"
                checked={store.selectedRoomMembers.has(member.id)}
                onChange={handleCheckChange}
              />
            )}
          </Observer>
        )}
      </Cell>
      <Observer>
        {() => (
          <Cell style={{ width: `${WIDTH.NICK + (isB2C ? 5 : 0)}%` }}>
            {member.nick}
          </Cell>
        )}
      </Observer>
      <Observer>
        {() => (
          <Cell style={{ width: `${WIDTH.LOGIN_ID + (isB2C ? 5 : 0)}%` }}>
            {member.loginId}
          </Cell>
        )}
      </Observer>
      <Observer>
        {() =>
          isB2C ? null : (
            <Cell style={{ width: `${WIDTH.TEAM}%` }}>{member.orgName}</Cell>
          )
        }
      </Observer>
      <Observer>
        {() =>
          isB2C ? null : (
            <Cell style={{ width: `${WIDTH.JOB}%` }}>
              {`${member.userJob || '-'}/${member.position || '-'}`}
            </Cell>
          )
        }
      </Observer>
      <Observer>
        {() => (
          <Cell style={{ width: `${WIDTH.PHONE + (isB2C ? 5 : 0)}%` }}>
            {member.userPhone}
          </Cell>
        )}
      </Observer>
      <Observer>
        {() => (
          <Cell style={{ width: `${WIDTH.ROLE + (isB2C ? 5 : 0)}%` }}>
            {getMemberType()}
          </Cell>
        )}
      </Observer>
      <Cell style={{ width: `${WIDTH.BUTTON}%` }}>
        <Button
          type="solid"
          size="small"
          onClick={handleTransfer}
          disabled={isAdmin() || member.grade === 'guest'}
        >
          {t('CM_CHANGE')}
        </Button>
      </Cell>
    </RowWrapper>
  );
};

const Table = () => {
  const { t } = useTranslation();
  const { roomSettingStore: store } = useStores();
  const { spaceStore } = useCoreStores();
  const tableBodyRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const isB2C = spaceStore.currentSpace.type === 'B2C';

  useEffect(() => {
    if (tableBodyRef.current) {
      setListHeight(tableBodyRef.current.offsetHeight);
    }
  }, [tableBodyRef]);

  const handleAllCheckChange = e => {
    if (e.target.checked) {
      store.selectedRoomMembers.replace(
        new Map(
          store
            .getFilteredMembers({ withoutMe: true })
            .map(member => [member.id, member]),
        ),
      );
    } else {
      store
        .getFilteredMembers({ withoutMe: true })
        .map(member => store.selectedRoomMembers.delete(member.id));
    }
  };

  return (
    <>
      <TableHeader>
        <HeaderCell style={{ width: `${WIDTH.CHECKBOX}%` }}>
          <Observer>
            {() => (
              <Checkbox
                className="check-round"
                checked={store.isAllChecked({ withoutMe: true })}
                onChange={handleAllCheckChange}
              />
            )}
          </Observer>
        </HeaderCell>
        <HeaderCell style={{ width: `${WIDTH.NICK + (isB2C ? 5 : 0)}%` }}>
          {t('CM_NICKNAME')}
        </HeaderCell>
        <HeaderCell style={{ width: `${WIDTH.LOGIN_ID + (isB2C ? 5 : 0)}%` }}>
          {t('CM_ID')}
        </HeaderCell>
        {isB2C ? null : (
          <>
            <HeaderCell style={{ width: `${WIDTH.TEAM}%` }}>
              {t('CM_TEAM')}
            </HeaderCell>
            <HeaderCell style={{ width: `${WIDTH.JOB}%` }}>
              {t('CM_TITLE_POSITION')}
            </HeaderCell>
          </>
        )}
        <HeaderCell style={{ width: `${WIDTH.PHONE + (isB2C ? 5 : 0)}%` }}>
          {t('CM_MOBILE_NUMBER')}
        </HeaderCell>
        <HeaderCell style={{ width: `${WIDTH.ROLE + (isB2C ? 5 : 0)}%` }}>
          {t('CM_SPACE_PERMISSION')}
        </HeaderCell>
        <HeaderCell style={{ width: `${WIDTH.BUTTON}%` }}>
          {t('CM_ROOM_PERMISSION_TRANSFER')}
        </HeaderCell>
      </TableHeader>
      <TableBody ref={tableBodyRef}>
        <Observer>
          {() => {
            const filteredMembers = store.getFilteredMembers({
              withoutMe: false,
            });
            return (
              <List
                height={listHeight}
                itemCount={filteredMembers.length}
                itemSize={remToPixel(3.19)}
                width="100%"
              >
                {({ index, style }) => (
                  <TableRow
                    style={style}
                    member={filteredMembers[index]}
                    isB2C={isB2C}
                  />
                )}
              </List>
            );
          }}
        </Observer>
      </TableBody>
    </>
  );
};

const MemberPage = ({ roomId }) => {
  const { t } = useTranslation();
  const { roomSettingStore: store } = useStores();
  const history = useHistory();

  // const handleSystemMessage = message => {
  //   console.log('**** noti type : ', message.NOTI_TYPE);
  //   if (message.SPACE_ID !== roomId) return;
  //   switch (message.NOTI_TYPE) {
  //     case 'addMember':
  //     case 'removeMember':
  //       store.fetchMembers({ roomId });

  //       break;
  //     default:
  //       break;
  //   }
  // };

  // useEffect(() => {
  //   store.fetchMembers({ roomId, summary: false });
  //   // WWMS.addHandler('SYSTEM', 'room_setting', handleSystemMessage);

  //   return () => {
  //     store.members = [];
  //     store.keyword = '';
  //     store.toastMessage = '';
  //     store.toastVisible = '';
  //     store.selectedMembers.clear();
  //     // WWMS.removeHandler('SYSTEM', 'room_setting');
  //   };
  // }, [roomId]);

  const handleTransferOk = async () => {
    const userId = store.targetMember.id;
    await store.transferAdmin({ roomId, userId });
    store.close('transfer');
    history.push(`/s/${roomId}/talk`);
  };

  const handleTransferCancel = () => {
    store.close('transfer');
  };

  const handleKickout = () => {
    store.open('kickout');
  };

  const handleKickoutOK = async () => {
    try {
      const userIdList = Array.from(store.selectedRoomMembers.keys());
      const result = await store.kickoutMembers({ roomId, userIdList });
      if (result) {
        await Promise.all([
          store.fetchMembers({ roomId }),
          store.fetchBlockedMembers({ roomId }),
        ]);
      }

      store.selectedRoomMembers.clear();
    } catch (err) {
      console.log('강퇴 / 밴 실패 : ', err);
    }
    store.close('kickout');
  };

  const handleKickoutCancel = () => {
    store.selectedRoomMembers.clear();
    store.close('kickout');
  };

  const handleInvite = () => {
    store.open('invite');
  };

  const handleInviteOk = async () => {
    await store.fetchMembers({ roomId });
    store.close('invite');
  };

  const handleInviteCancel = () => {
    store.close('invite');
  };

  const handleSearchClear = () => {
    store.keyword = '';
  };

  const handleSearchEnterPress = e => {
    store.keyword = e.target.value;
  };

  const themeContext = useContext(ThemeContext);

  return (
    <>
      <Observer>
        {() => (
          <RoomAddMemberModal
            visible={store.inviteVisible}
            roomId={roomId}
            onInviteUsers={handleInviteOk}
            onCancel={handleInviteCancel}
          />
        )}
      </Observer>

      <Observer>
        {() => (
          <Message
            visible={store.transferVisible}
            title={t('CM_ROOM_SETTING_MANAGE_PEOPLE_05', {
              name: store.targetMember?.nick || '',
            })}
            subtitle={t('CM_ROOM_SETTING_MANAGE_PEOPLE_06')}
            type="error"
            btns={[
              {
                type: 'solid',
                shape: 'round',
                text: t('CM_LOGIN_POLICY_03'),
                onClick: handleTransferOk,
              },
              {
                type: 'outlined',
                shape: 'round',
                text: t('CM_CANCEL'),
                onClick: handleTransferCancel,
              },
            ]}
          />
        )}
      </Observer>

      <Observer>
        {() => (
          <Message
            visible={store.kickoutVisible}
            title={t('CM_ROOM_SETTING_FORCED_EXIT_01')}
            subtitle={t('CM_ROOM_SETTING_FORCED_EXIT_02')}
            type="error"
            btns={[
              {
                type: 'solid',
                shape: 'round',
                text: t('CM_LOGIN_POLICY_03'),
                onClick: handleKickoutOK,
              },
              {
                type: 'outlined',
                shape: 'round',
                text: t('CM_CANCEL'),
                onClick: handleKickoutCancel,
              },
            ]}
          />
        )}
      </Observer>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '0.63rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.81rem',
              fontWeight: '600',
              margin: '0 1.25rem',
              color: `${props => props.theme.TextMain}`,
            }}
          >
            <Observer>
              {() => (
                <Trans
                  i18nKey="CM_ROOM_SETTING_MANAGE_PEOPLE_02"
                  components={{
                    style: (
                      <span
                        style={{
                          color: themeContext.TextPoinGreen,
                        }}
                      />
                    ),
                  }}
                  values={{
                    num: store.getFilteredMembers({ withoutMe: false }).length,
                  }}
                />
              )}
            </Observer>
          </span>
          <Button
            type="solid"
            size="small"
            style={{ marginRight: '0.5rem' }}
            onClick={handleInvite}
            className="color-green"
          >
            {`+ ${t('CM_ROOM_INVITE_USER')}`}
          </Button>
          <Observer>
            {() => (
              <Button
                type="outlined"
                size="small"
                onClick={handleKickout}
                disabled={!store.selectedRoomMembers.size}
              >
                {t('CM_REMOVE')}
              </Button>
            )}
          </Observer>
        </div>
        <div style={{ width: '13.31rem' }}>
          <WaplSearch
            type="default"
            searchIconColor={{ active: '#7C7670', default: '#CAC4BD' }}
            placeholder={t('CM_NICKNAME_TEAM_TITLE_SEARCH')}
            onClear={handleSearchClear}
            onEnterDown={handleSearchEnterPress}
            isCountExist={false}
          />
        </div>
      </div>

      <Table />
    </>
  );
};

export default MemberPage;

const IconWrapper = styled.div`
  width: fit-content;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e7eb;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 2rem;
  border-bottom: 1px solid #232d3b;
`;

const TableBody = styled.div`
  height: 100%;
`;

const Cell = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 0.5rem;
  font-size: 0.81rem;
`;

const HeaderCell = styled(Cell)`
  color: #75757f;
  font-size: 0.75rem;
`;
