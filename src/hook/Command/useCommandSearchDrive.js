// /* eslint-disable import/prefer-default-export */
// import { useCallback, useEffect } from 'react';
// import { useCoreStores } from 'teespace-core';

// export const useCommandSearchDrive = propHandler => {
//   const { commandStore } = useCoreStores();
//   const handler = useCallback(() => {
//     propHandler();
//   }, [propHandler]);

//   useEffect(() => {
//     const command = '/search drive';

//     commandStore.register('drive', command, handler, {
//       desc: {
//         // TODO: ui string 발간 이후 변경할 것
//         ko: '파일을 검색하세요.',
//         en: 'Search file of current room',
//       },
//     });

//     return () => commandStore.get(command) && commandStore.unregister(command);
//   }, [commandStore, handler]);
// };
