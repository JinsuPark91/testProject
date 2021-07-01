import React from 'react';
import styled from 'styled-components';
import { Observer, useObserver, useLocalStore } from 'mobx-react';
import { observable, extendObservable, transaction } from 'mobx';
import { Modal, Button } from 'antd';
import itemDefaultImage from '../../assets/item_default.svg';
import itemSelectedImage from '../../assets/item_selected.svg';
import formImage from '../../assets/item_form.svg';
import { useStores } from '../../stores';

const store = observable({
  items: [],
  selectedCount: 0,
  // init, ready, done
  state: 'init',

  get isMoreSelect() {
    return this.items.length - this.selectedCount > 1;
  },

  setState(state) {
    if (state === 'init' || state === 'ready' || state === 'done') {
      this.state = state;
    }
  },

  suffle() {
    this.items.replace(this.items.sort(() => Math.random() - 0.5));
  },

  reset() {
    transaction(() => {
      this.state = 'init';
      this.items = [];
      this.selectedCount = 0;
    });
  },

  retry() {
    this.state = 'ready';
  },

  addItem(item) {
    this.items.push(item);
  },
});

class ItemModel {
  constructor({ value }) {
    extendObservable(this, {
      value,
      isOpened: false,
    });
  }
}

const Item = ({ info }) => {
  const handleOpen = () => {
    if (!info.isOpened && store.state === 'ready') {
      transaction(() => {
        info.isOpened = true;
        store.state = 'done';
        store.selectedCount += 1;
      });
    }
  };

  return useObserver(() =>
    info.isOpened ? (
      <ItemWrapper selected>
        <Content>{info.value}</Content>
      </ItemWrapper>
    ) : (
      <ItemWrapper onClick={handleOpen} selected={false} />
    ),
  );
};

const ItemGenerator = () => {
  const localStore = useLocalStore(() => ({
    value: '',
  }));

  const handleOk = () => {
    transaction(() => {
      const item = new ItemModel({ value: localStore.value });
      store.addItem(item);
      localStore.value = '';
      localStore.isEditMode = false;
    });
  };

  const handleCancel = () => {
    transaction(() => {
      localStore.value = '';
      localStore.isEditMode = false;
    });
  };

  const handleChange = e => {
    localStore.value = e.target.value;
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      handleOk();
    } else if (e.keyCode === 27) {
      handleCancel();
    }
  };

  return (
    <PaperWrapper>
      <Observer>
        {() => (
          <StyledInput
            placeholder="Enter / Esc"
            autoFocus
            onChange={handleChange}
            value={localStore.value}
            onKeyDown={handleKeyDown}
          />
        )}
      </Observer>
    </PaperWrapper>
  );
};

const Est = ({ visible }) => {
  const { uiStore } = useStores();
  const handleClose = () => {
    transaction(() => {
      uiStore.isEstVisible = false;
      store.reset();
    });
  };

  const handleReady = () => {
    store.setState('ready');
  };

  const handleSuffle = () => {
    store.suffle();
  };

  const handleReset = () => {
    store.reset();
  };

  const handleRetry = () => {
    store.retry();
  };

  const getButtons = () => {
    if (store.state === 'init') {
      return (
        <Button
          size="small"
          type="solid"
          onClick={handleReady}
          disabled={!store.items.length}
        >
          준비
        </Button>
      );
    }
    if (store.state === 'ready') {
      return (
        <>
          <Button size="small" type="solid" onClick={handleSuffle}>
            섞기
          </Button>
        </>
      );
    }
    if (store.state === 'done') {
      return store.isMoreSelect ? (
        <Button size="small" type="solid" onClick={handleRetry}>
          한번더 뽑기
        </Button>
      ) : null;
    }
    return null;
  };

  return (
    <StyledModal
      visible={visible}
      width="43rem"
      footer={null}
      keyboard={false}
      onCancel={handleClose}
    >
      <ItemContainer>
        <Observer>
          {() =>
            store.items.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Item key={`item-${index}`} info={item} />
            ))
          }
        </Observer>
        <Observer>
          {() => (store.state === 'init' ? <ItemGenerator /> : null)}
        </Observer>
      </ItemContainer>

      <Observer>
        {() => (
          <>
            {getButtons()}
            <Button
              size="small"
              type="outlined"
              onClick={handleReset}
              style={{ marginLeft: '0.5rem' }}
            >
              리셋
            </Button>
          </>
        )}
      </Observer>
    </StyledModal>
  );
};

export default Est;

const StyledModal = styled(Modal)``;

const StyledInput = styled.input`
  width: 100%;
  border: 0;
  border-bottom: 1px solid black;
  padding: 0 0 0 0.3rem;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const Content = styled.span`
  padding: 0.4rem;
  background: #eee;
  border: 1px solid #666;
  font-weight: bold;
  border-radius: 0.8rem;
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
  max-width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  flex: 0 0 10rem;
  height: 10rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  min-width: 0;
`;

const ItemWrapper = styled(Wrapper)`
  justify-content: center;
  padding: 3rem 2rem 0 2rem;
  background-image: url(${({ selected }) =>
    selected ? itemSelectedImage : itemDefaultImage});
`;

const PaperWrapper = styled(ItemWrapper)`
  padding: 2rem;
  background-image: url(${formImage});
`;
