import './user-not-found.css';
import { UserNotFoundIco } from '../../../../assets/icons/UserNotFoundIco.tsx';
import { useTranslation } from 'react-i18next';

export const UserNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className={'user-not-found-container'}>
      <UserNotFoundIco className={'user-not-found-icon'} />
      <span>{t('users.notFound')}</span>
    </div>
  );
};
