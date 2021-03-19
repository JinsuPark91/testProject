import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { WaplSearch, Toast } from 'teespace-core';
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
  NICK: '15%',
  LOGIN_ID: '25%',
  TEAM: '15%',
  JOB: '15%',
  PHONE: '25%',
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
        {() => <Cell style={{ width: WIDTH.TEAM }}>{member.userJob}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.JOB }}>{member.position}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.PHONE }}>{member.userPhone}</Cell>}
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
        <HeaderCell style={{ width: WIDTH.TEAM }}>{t('CM_TEAM')}</HeaderCell>
        <HeaderCell style={{ width: WIDTH.JOB }}>
          {t('CM_TITLE_POSITION')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.PHONE }}>
          {t('CM_MOBILE_NUMBER')}
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

  useEffect(() => {
    // TODO : fetchRequests()
    store.fetchBlockedMembers({ roomId });

    return () => {
      store.members = [];
      store.keyword = '';
      store.toastMessage = '';
      store.toastVisible = '';
      store.selectedMembers.clear();
    };
  }, []);

  const handleUnblock = () => {
    store.open(
      'toast',
      t('CM_ROOM_SETTING_MANAGE_PEOPLE_04', {
        num: store.selectedMembers.size,
      }),
    );
    store.selectedMembers.clear();
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
                  i18nKey="CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_02"
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
                <Button
                  type="solid"
                  size="small"
                  style={style}
                  onClick={handleUnblock}
                  disabled={isEmpty}
                >
                  {t('CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_03')}
                </Button>
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
