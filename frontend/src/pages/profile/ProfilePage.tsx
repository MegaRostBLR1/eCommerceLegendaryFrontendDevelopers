import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfilePage.css';
import { authorizationService } from '../../services/authorization-service';
import { userService } from '../../services/user.service';
import type { User, UpdateUserDto } from '../../types';
import { Message } from '../../components/message/Message';

type MessageState = {
  type: 'success' | 'error';
  text: string;
};

export const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const userId = authorizationService.getUserId();

  const { id } = useParams<{ id: string }>();
  const isAdmin = authorizationService.userIsAdmin();
  const myOwnId = authorizationService.getUserId();

  const targetUserId = id ? Number(id) : myOwnId;
  const isEditingSomeoneElse = Boolean(id) && isAdmin;

  useEffect(() => {
    if (!authorizationService.isAuthUser()) {
      navigate('/');
    }
  }, [navigate, userId]);

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await userService.getProfile(targetUserId);
        setUser(data);
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Error loading profile' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [targetUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleUpdate = async () => {
    if (!user || !targetUserId) return;

    const newErrors: string[] = [];
    if (!user.firstName.trim()) newErrors.push('firstName');
    if (!user.lastName.trim()) newErrors.push('lastName');
    if (!user.email.trim()) newErrors.push('email');
    setErrors(newErrors);

    if (newErrors.length > 0) {
      setMessage({ type: 'error', text: 'Fill in the red fields!' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const updateData: UpdateUserDto = {
      firstName: user.firstName,
      lastName: user.lastName,
      patronymic: user.patronymic,
      email: user.email,
      role: isAdmin ? user.role : undefined,
    };

    if (isAdmin) {
      updateData.role = user.role;
    }

    try {
      const updated = await userService.updateProfile(targetUserId, updateData);

      setUser(updated);
      setMessage({ type: 'success', text: 'Data updated successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <main className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">
          {' '}
          {isEditingSomeoneElse ? `EDIT USER #${id}` : 'PERSONAL DATA'}{' '}
        </h1>

        {message && (
          <Message
            type={message.type}
            text={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        <div className="profile-form">
          <div className="profile-grid">
            <div className="input-field">
              <label>Name</label>
              <input
                name="firstName"
                value={user.firstName || ''}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) =>
                    prev.filter((item) => item !== 'firstName')
                  );
                }}
                className={errors.includes('firstName') ? 'input-error' : ''}
              />
            </div>

            <div className="input-field">
              <label>Last name</label>
              <input
                name="lastName"
                value={user.lastName || ''}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) =>
                    prev.filter((item) => item !== 'lastName')
                  );
                }}
                className={errors.includes('lastName') ? 'input-error' : ''}
              />
            </div>

            <div className="input-field">
              <label>Patronymic</label>
              <input
                name="patronymic"
                value={user.patronymic || ''}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={user.email || ''}
                readOnly={true}
                onChange={(e) => {
                  handleChange(e);
                  setErrors((prev) => prev.filter((item) => item !== 'email'));
                }}
                className={errors.includes('email') ? 'input-error' : ''}
              />
            </div>
          </div>

          <div className="role-field">
            <div className="input-field">
              <label>Role</label>

              {isAdmin ? (
                <input
                  name="role"
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  onChange={handleChange}
                  className="profile-select"
                  readOnly={true}
                />
              ) : (
                <input
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  readOnly={true}
                  className="profile-select"
                />
              )}
            </div>
          </div>

          <button className="edit-btn" onClick={handleUpdate} disabled={saving}>
            {saving ? 'Saving...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </main>
  );
};
