import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { WaplSearch, Toast, WWMS } from 'teespace-core';
import styled from 'styled-components';
import { Observer } from 'mobx-react';
import { Button, Checkbox } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { RoomSettingStore as store } from '../../stores/RoomSettingStore';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const WIDTH = {
  CHECKBOX: '5%',
  NICK: '10%',
  LOGIN_ID: '65%',
  REQUEST_AT: '20%',
};

const TableRow = ({ style, member }) => {
  const handleCheckChange = e => {
    if (e.target.checked) {
      store.selectedMembers.set(member.id, member);
    } else {
      store.selectedMembers.delete(member.id);
    }
  };

  if (!member) return null;

  return (
    <RowWrapper style={style}>
      <Cell style={{ width: WIDTH.CHECKBOX }}>
        <Observer>
          {() => (
            <Checkbox
              className="check-round"
              checked={store.selectedMembers.has(member.id)}
              onChange={handleCheckChange}
            />
          )}
        </Observer>
      </Cell>
      <Observer>
        {() => <Cell style={{ width: WIDTH.NICK }}>{member.name}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.LOGIN_ID }}>{member.loginId}</Cell>}
      </Observer>
      <Observer>
        {() => (
          <Cell style={{ width: WIDTH.REQUEST_AT }}>{member.reqRegDate}</Cell>
        )}
      </Observer>
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
        new Map(store.filteredMembers.map(member => [member.id, member])),
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
                checked={store.isAllChecked(false)}
                onChange={handleAllCheckChange}
              />
            )}
          </Observer>
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.NICK }}>
          {t('CM_NICKNAME')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.LOGIN_ID }}>{t('CM_ID')}</HeaderCell>
        <HeaderCell style={{ width: WIDTH.REQUEST_AT }}>
          {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_05')}
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

const SubWaitingMemberPage = ({ roomId }) => {
  const { t } = useTranslation();

  const handleSystemMessage = message => {
    console.log('setting page store : ', message);
    if (message.SPACE_ID !== roomId) return;

    switch (message.NOTI_TYPE) {
      case 'memberRequest':
        store.fetchRequestMembers({ roomId });

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    store.fetchRequestMembers({ roomId });
    WWMS.addHandler('SYSTEM', 'room_setting', handleSystemMessage);

    return () => {
      store.members = [];
      store.keyword = '';
      store.toastMessage = '';
      store.toastVisible = false;
      store.selectedMembers.clear();
      WWMS.removeHandler('SYSTEM', 'room_setting');
    };
  }, []);

  const handleAccept = async () => {
    const userIdList = Array.from(store.selectedMembers.keys());

    try {
      const result = await store.acceptUsers({ roomId, userIdList });
      if (result) {
        store.open(
          'toast',
          t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_07', {
            num: store.selectedMembers.size,
          }),
        );
      }

      store.selectedMembers.clear();
    } catch (err) {
      console.log('입장 허가 에러 : ', err);
    }
  };

  const handleReject = async () => {
    const userIdList = Array.from(store.selectedMembers.keys());

    try {
      const result = await store.rejectUsers({ roomId, userIdList });
      if (result) {
        store.open(
          'toast',
          t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_08', {
            num: store.selectedMembers.size,
          }),
        );

        store.selectedMembers.clear();
      }
    } catch (err) {
      console.log('입장 거절 에러 : ', err);
    }
  };

  const handleSearchClear = () => {
    store.keyword = '';
  };

  const handleSearchEnterPress = e => {
    store.keyword = e.target.value;
  };

  const handleToastClose = () => {
    store.close('toast');
  };

  return (
    <>
      <Observer>
        {() => (
          <Toast
            visible={store.toastVisible}
            timeoutMs={1000}
            onClose={handleToastClose}
          >
            {store.toastMessage}
          </Toast>
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
                  i18nKey="CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_02"
                  components={{
                    styled: <span style={{ color: 'rgb(87, 66, 200)' }} />,
                  }}
                  values={{ num: store.filteredMembers.length }}
                />
              )}
            </Observer>
          </span>
          <Observer>
            {() => {
              const isEmpty = !store.selectedMembers.size;
              const style = { marginRight: '0.5rem' };
              if (!isEmpty) {
                style.backgroundColor = '#205855';
              }

              return (
                <>
                  <Button
                    type="solid"
                    size="small"
                    style={style}
                    onClick={handleAccept}
                    disabled={isEmpty}
                  >
                    {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_03')}
                  </Button>

                  <Button
                    type="outlined"
                    size="small"
                    onClick={handleReject}
                    disabled={isEmpty}
                  >
                    {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_04')}
                  </Button>
                </>
              );
            }}
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
      <span style={{ fontSize: '0.75rem', color: '#666666' }}>{`*${t(
        'CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_06',
      )}`}</span>
    </>
  );
};

export default SubWaitingMemberPage;

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
