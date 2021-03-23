import React from 'react';
import { AdminPage as AdminPageComponent } from 'teespace-admin';
import { useTranslation } from 'react-i18next';

function AdminPage() {
  const { i18n } = useTranslation();
  return <AdminPageComponent language={i18n.language} />;
}

export default AdminPage;
