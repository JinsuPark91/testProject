import { observable } from 'mobx';
import { useState } from 'react';

// FIXME: 최신 mobx에는 지원하는 hook (mobx 버전이 올라갈시 제거)
export default function useLocalObservable(initializer, annotations) {
  return useState(() => observable(initializer(), annotations))[0];
}
