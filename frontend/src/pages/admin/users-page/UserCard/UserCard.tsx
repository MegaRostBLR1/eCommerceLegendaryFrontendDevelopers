import { useState } from 'react';
import './user-card.css';
import { LogoUser } from '../../../../assets/icons/LogoUser.tsx';
import { IconButton, Tooltip } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditUserModal from '../../../../components/modals/EditUserModal/EditUserModal.tsx';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleOrdersClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/orders/${userId}`);
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
          <div className={'email-and-role'}>
            <span>E-mail: {userEmail}</span>
            <span>Role: {userRole}</span>
          </div>
        </div>

        <div
          className="user-card-actions"
          style={{ display: 'flex', gap: '4px' }}
        >
          <Tooltip title="View User Orders">
            <IconButton
              className={'orders-card-btn'}
              onClick={handleOrdersClick}
            >
              <ListAltIcon fontSize="small" sx={{ color: '#063526' }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit User">
            <IconButton className={'edit-card-btn'} onClick={handleEditClick}>
              <BorderColorIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
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
