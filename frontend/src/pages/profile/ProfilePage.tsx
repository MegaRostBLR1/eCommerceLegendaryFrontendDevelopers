import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  const userId = authorizationService.getUserId();

  useEffect(() => {
    if (!authorizationService.isAuthUser()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await userService.getProfile(userId);
        setUser(data);
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Error loading profile' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleUpdate = async () => {
    if (!user || !userId) return;

    if (!user.firstName.trim() || !user.lastName.trim() || !user.email.trim()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields (Name, Last name, E-mail)',
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    const updateData: UpdateUserDto = {
      firstName: user.firstName,
      lastName: user.lastName,
      patronymic: user.patronymic,
      email: user.email,
    };

    try {
      const updated = await userService.updateProfile(userId, updateData);
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
        <h1 className="profile-title">PERSONAL DATA</h1>

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
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <label>Last name</label>
              <input
                name="lastName"
                value={user.lastName || ''}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <label>Surname</label>
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
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="role-field">
            <div className="input-field">
              <label>Role</label>
              <input
                value={user.role}
                readOnly
                className="input-readonly"
                tabIndex={-1}
              />
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
