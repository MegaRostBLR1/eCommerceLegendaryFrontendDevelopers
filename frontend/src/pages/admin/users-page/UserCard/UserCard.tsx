import { useState } from 'react';
import './user-card.css';
import { LogoUser } from '../../../../assets/icons/LogoUser.tsx';
import { IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import EditUserModal from '../../../../components/modals/EditUserModal/EditUserModal.tsx';

export const UserCard = ({
                           userId,
                           userFirstName,
                           userLastName,
                           userEmail,
                           userRole,
                           userPatronymic,
                           onRefresh,
                         }: {
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userRole: string;
  userPatronymic: string;
  onRefresh?: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className={'user-card-container'}>
      <div className={'users-card'}>
        <div className={'user-logo'}>
          <LogoUser />
        </div>
        <div className={'user-information'}>
          <div className={'user-full-name'}>
            <span>{userFirstName}</span>
            <span>{userLastName}</span>
            <span>{userPatronymic}</span>
          </div>
          <div className={"email-and-role"}>
            <span>E-mail: {userEmail}</span>
            <span>Role: {userRole}</span>
          </div>
        </div>
        <IconButton className={'edit-card-btn'} onClick={handleEditClick}>
          <BorderColorIcon fontSize="small" />
        </IconButton>
      </div>

      <EditUserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateSuccess={onRefresh}
        user={{
          id: userId,
          firstName: userFirstName,
          lastName: userLastName,
          patronymic: userPatronymic,
          email: userEmail,
          role: userRole,
        }}
      />
    </div>
  );
};