import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Snackbar,
  CircularProgress,
  Box,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';
import { Card } from '../../../components/card/card';
import EditCardModal from '../../../components/modals/EditCardModal/EditCardModal';
import { mapAiResponseToService } from './ai-mapper';
import catalogStyles from '../../catalog-page/catalog-page.module.css';
import { userService } from '../../../services/user.service';
import type { Service, UpdateServiceDto, Category } from '../../../types';
import { apiService } from '../../../services/api-service.ts';
import './AIGenerationPage.css';
import { useTranslation } from 'react-i18next';
import { aiService } from './ai.service';

export const AIGenerationPage = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [drafts, setDrafts] = useState<Service[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService<Category[]>('/categories');
        setAllCategories(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : t('ai.categoryError');
        setSnackMessage(errorMessage);
        setSnackOpen(true);
      }
    };
    fetchCategories();
  }, [t]);

  const formatForBackend = (service: Service): UpdateServiceDto => ({
    name: service.name,
    amount: service.amount,
    description: service.description,
    duration: Number(service.duration),
    workersCount: service.workersCount,
    discount: service.discount ?? 0,
    categories: service.categories?.map((c) => c.id) || [],
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      const rawData = await aiService.generateServices(prompt);
      setDrafts(rawData.map(mapAiResponseToService));
    } catch {
      setSnackMessage(t('ai.generateError'));
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalUpdate = (updatedData: Service) => {
    setDrafts((prev) =>
      prev.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setIsModalOpen(false);
  };

  const handleSendOneToServer = async (service: Service) => {
    try {
      await userService.createService(formatForBackend(service));
      setDrafts((prev) => prev.filter((d) => d.id !== service.id));
      setIsModalOpen(false);
      setSnackMessage(t('ai.saveSuccess'));
      setSnackOpen(true);
    } catch {
      setSnackMessage(t('ai.duplicateError'));
      setSnackOpen(true);
    }
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        drafts.map((d) => userService.createService(formatForBackend(d)))
      );
      setDrafts([]);
      setSnackMessage(t('ai.saveAllSuccess'));
      setSnackOpen(true);
    } catch {
      setSnackMessage(t('ai.duplicateError'));
      setSnackOpen(true);
    }
  };

  return (
    <main className={`${catalogStyles.main} no-scroll`}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <section
        className={catalogStyles.catalog}
        style={{ paddingTop: 10, marginTop: 0 }}
      >
        <div
          className={`${catalogStyles.container} page-container ai-page-column`}
        >
          <div className="ai-controls-row">
            <div className="ai-input-wrapper">
              <TextField
                className="ai-text-field"
                fullWidth
                multiline
                placeholder={t('ai.placeholder')}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
              />
              <Button
                variant="contained"
                onClick={handleGenerate}
                className="ai-generate-button"
                disabled={loading}
              >
                {<AutoAwesomeIcon />}
              </Button>
            </div>

            {!loading && drafts.length > 0 && (
              <Button
                variant="contained"
                className="ai-save-all-header-btn"
                onClick={handleSaveAll}
                startIcon={<SaveIcon />}
              >
                {t('ai.saveAllBtn')}
              </Button>
            )}
          </div>

          {loading ? (
            <Box className="ai-loader-container">
              <CircularProgress size={80} sx={{ color: '#074733' }} />
            </Box>
          ) : (
            <>
              <div
                className={`ai-scroll-container ${drafts.length > 0 ? 'has-content' : ''}`}
              >
                <div className={`${catalogStyles.cards} ai-cards-grid`}>
                  {drafts.map((draft) => (
                    <Card
                      key={draft.id}
                      data={draft}
                      isAdminMode
                      handleClick={() => {
                        setSelectedDraft(draft);
                        setIsModalOpen(true);
                      }}
                      onDelete={() =>
                        setDrafts((prev) =>
                          prev.filter((d) => d.id !== draft.id)
                        )
                      }
                    />
                  ))}
                </div>
              </div>
              {drafts.length === 0 && (
                <p className="ai-empty-text">{t('ai.emptyText')}</p>
              )}
            </>
          )}
        </div>
      </section>

      {selectedDraft && (
        <EditCardModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedDraft}
          onLocalUpdate={handleLocalUpdate}
          onSendToServer={handleSendOneToServer}
          isDraft={true}
          availableCategories={allCategories}
        />
      )}
    </main>
  );
};
