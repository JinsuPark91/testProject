import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Message, WaplSearch, WWMS } from 'teespace-core';
import styled from 'styled-components';
import { Observer } from 'mobx-react';
import { Button, Checkbox } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { LeaderIcon } from '../Icons';
import RoomAddMemberModal from './RoomAddMemberModal';
import { RoomSettingStore as store } from '../../stores/RoomSettingStore';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const WIDTH = {
  CHECKBOX: '5%',
  NICK: '10%',
  LOGIN_ID: '20%',
  TEAM: '10%',
  JOB: '10%',
  PHONE: '15%',
  ROLE: '15%',
  BUTTON: '15%',
};

const TableRow = ({ style, member }) => {
  const { t } = useTranslation();
  const isAdmin = () => member.role === 'WKS0004';

  const handleTransfer = () => {
    store.member = member;
    store.open('transfer');
  };

  const handleCheckChange = e => {
    if (e.target.checked) {
      store.selectedMembers.set(member.id, member);
    } else {
      store.selectedMembers.delete(member.id);
    }
  };

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
      <Cell style={{ width: WIDTH.CHECKBOX }}>
        {isAdmin() ? (
          <LeaderIcon width={1.13} height={1.13} color="#205855" />
        ) : (
          <Observer>
            {() => (
              <Checkbox
                className="check-round"
                checked={store.selectedMembers.has(member.id)}
                onChange={handleCheckChange}
              />
            )}
          </Observer>
        )}
      </Cell>
      <Observer>
        {() => <Cell style={{ width: WIDTH.NICK }}>{member.name}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.LOGIN_ID }}>{member.loginId}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.TEAM }}>{member.userJob}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.JOB }}>{member.position}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.PHONE }}>{member.userPhone}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.ROLE }}>{getMemberType()}</Cell>}
      </Observer>
      <Cell style={{ width: WIDTH.BUTTON }}>
        <Button
          type="solid"
          size="small"
          onClick={handleTransfer}
          disabled={isAdmin()}
        >
          {t('CM_CHANGE')}
        </Button>
      </Cell>
    </RowWrapper>
  );
};

const Table = () => {
  const { t } = useTranslation();
  const tableBodyRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (tableBodyRef.current) {
      setListHeight(tableBodyRef.current.offsetHeight);
    }
  }, [tableBodyRef]);

  const handleAllCheckChange = e => {
    if (e.target.checked) {
      store.selectedMembers.replace(
        new Map(
          store.filteredMembersWithoutMe.map(member => [member.id, member]),
        ),
      );
    } else {
      store.selectedMembers.clear();
    }
  };

  return (
    <>
      <TableHeader>
        <HeaderCell style={{ width: WIDTH.CHECKBOX }}>
          <Observer>
            {() => (
              <Checkbox
                className="check-round"
                checked={store.isAllChecked(true)}
                onChange={handleAllCheckChange}
              />
            )}
          </Observer>
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.NICK }}>
          {t('CM_NICKNAME')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.LOGIN_ID }}>{t('CM_ID')}</HeaderCell>
        <HeaderCell style={{ width: WIDTH.TEAM }}>{t('CM_TEAM')}</HeaderCell>
        <HeaderCell style={{ width: WIDTH.JOB }}>
          {t('CM_TITLE_POSITION')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.PHONE }}>
          {t('CM_MOBILE_NUMBER')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.ROLE }}>
          {t('CM_SPACE_PERMISSION')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.BUTTON }}>
          {t('CM_ROOM_PERMISSION_TRANSFER')}
        </HeaderCell>
      </TableHeader>
      <TableBody ref={tableBodyRef}>
        <Observer>
          {() => (
            <List
              height={listHeight}
              itemCount={store.filteredMembers.length}
              itemSize={remToPixel(3.19)}
              width="100%"
            >
              {({ index, style }) => {
                const member = store.filteredMembers[index];
                return <TableRow style={style} member={member} />;
              }}
            </List>
          )}
        </Observer>
      </TableBody>
    </>
  );
};

const MemberPage = ({ roomId }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleSystemMessage = message => {
    if (message.SPACE_ID !== roomId) return;

    switch (message.NOTI_TYPE) {
      case 'addMember':
      case 'removeMember':
        store.fetchMembers({ roomId });

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    store.fetchMembers({ roomId });
    WWMS.addHandler('SYSTEM', 'room_setting', handleSystemMessage);

    return () => {
      store.members = [];
      store.keyword = '';
      store.toastMessage = '';
      store.toastVisible = '';
      store.selectedMembers.clear();
      WWMS.removeHandler('SYSTEM', 'room_setting');
    };
  }, []);

  const handleTransferOk = async () => {
    const userId = store.member.id;
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
      const userIdList = Array.from(store.selectedMembers.keys());
      await store.kickoutMembers({ roomId, userIdList });
      store.selectedMembers.clear();
    } catch (err) {
      console.log('강퇴 / 밴 실패 : ', err);
    }
    store.close('kickout');
  };

  const handleKickoutCancel = () => {
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
              name: store.member?.name ? store.member.name : '',
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
            }}
          >
            <Observer>
              {() => (
                <Trans
                  i18nKey="CM_ROOM_SETTING_MANAGE_PEOPLE_02"
                  components={{
                    styled: <span style={{ color: 'rgb(87, 66, 200)' }} />,
                  }}
                  values={{ num: store.filteredMembers.length }}
                />
              )}
            </Observer>
          </span>
          <Button
            type="solid"
            size="small"
            style={{ backgroundColor: '#205855', marginRight: '0.5rem' }}
            onClick={handleInvite}
          >
            {`+ ${t('CM_ROOM_INVITE_USER')}`}
          </Button>
          <Observer>
            {() => (
              <Button
                type="outlined"
                size="small"
                onClick={handleKickout}
                disabled={!store.selectedMembers.size}
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
