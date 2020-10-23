import React, { useCallback, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Item, Container } from './Components';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    border: '1px solid black',
    flexDirection: 'column',
  },

  outerContainer: {
    width: '300px',
    height: '300px',
    backgroundColor: 'black',
  },

  innerContainer: {
    width: '200px',
    height: '200px',
    backgroundColor: 'gray',
  },

  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '50px',
    border: '1px dashed black',
    margin: '10px',
    color: 'black',
    fontWeight: '600',
  },
};

function TestPage() {
  const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true);
  const toggle = useCallback(() => setHideSourceOnDrag(!hideSourceOnDrag), [
    hideSourceOnDrag,
  ]);

  const handleOuterDrop = useCallback((item, monitor) => {
    if (!monitor.didDrop()) console.log('outer drop!!', item);
  }, []);

  const handleInnerDrop = useCallback((item, monitor) => {
    if (!monitor.didDrop()) console.log('inner drop!!', item);
  }, []);

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Container
          accept={['file']}
          onDrop={handleOuterDrop}
          style={{ ...styles.container, ...styles.outerContainer }}
        >
          <span>Outer Container</span>
          <Container
            accept={['file', 'message']}
            onDrop={handleInnerDrop}
            style={{ ...styles.container, ...styles.innerContainer }}
          >
            <span>Inner Container</span>

            <Item
              style={styles.item}
              hideSourceOnDrag={hideSourceOnDrag}
              type="message"
            >
              <span>Message Item</span>
            </Item>
            <Item
              style={styles.item}
              hideSourceOnDrag={hideSourceOnDrag}
              type="file"
            >
              <span>File Item</span>
            </Item>

            <Item
              style={styles.item}
              hideSourceOnDrag={hideSourceOnDrag}
              type="mail"
            >
              <span>Mail Item</span>
            </Item>
          </Container>
        </Container>

        <Item
          hideSourceOnDrag={hideSourceOnDrag}
          style={styles.item}
          type="message"
        >
          <span>Message Item</span>
        </Item>
        <Item
          hideSourceOnDrag={hideSourceOnDrag}
          style={styles.item}
          type="file"
        >
          <span>File Item</span>
        </Item>

        <Item
          hideSourceOnDrag={hideSourceOnDrag}
          style={styles.item}
          type="mail"
        >
          <span>Mail Item</span>
        </Item>

        <label htmlFor="hideSourceOnDrag">
          <input
            id="hideSourceOnDrag"
            type="checkbox"
            checked={hideSourceOnDrag}
            onChange={toggle}
          />
          <small>드래그 하는 동안 원본 숨김</small>
        </label>
      </DndProvider>
    </div>
  );
}

export default TestPage;
