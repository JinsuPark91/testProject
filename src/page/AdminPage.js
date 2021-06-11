import React, { useEffect, useState } from 'react';
import { AdminPage as AdminPageComponent } from 'teespace-admin';
import { useCoreStores } from 'teespace-core';

function AdminPage() {
  const { userStore } = useCoreStores();
  const [language, setLangauge] = useState(window.navigator.language);

  useEffect(() => {
    (async () => {
      const { language: lang } = await userStore.getMyDomainSetting();
      setLangauge(lang);
    })();
  }, []);
  return <AdminPageComponent language={language} />;
}

export default AdminPage;
