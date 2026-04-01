import './not-found-page.css';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className={'not-found-page-container'}>
      <div className={'not-found-message-container'}>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.message')}</p>
        <a href="/">{t('notFound.backLink')}</a>
      </div>
    </div>
  );
};
