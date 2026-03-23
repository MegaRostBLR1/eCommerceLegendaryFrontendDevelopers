import { useState, useEffect } from 'react';
import { Button, TextField, Snackbar } from '@mui/material';
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

import { aiService } from './ai.service';

export const AIGenerationPage = () => {
  const [prompt, setPrompt] = useState('');
  const [drafts, setDrafts] = useState<Service[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService<Category[]>('/categories');
        setAllCategories(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
        setSnackMessage(errorMessage);
        setSnackOpen(true);
      }
    };

    fetchCategories();
  }, []);

  const formatForBackend = (service: Service): UpdateServiceDto => ({
    name: service.name,
    amount: service.amount,
    description: service.description,
    duration: Number(service.duration),
    workersCount: service.workersCount,
    discount: service.discount ?? 0,
    categories:
      service.categories && service.categories.length
        ? service.categories.map((c) => c.id)
        : [],
  });

  const handleGenerate = async () => {
    try {
      const rawData = await aiService.generateServices(prompt);
      const normalized = rawData.map(mapAiResponseToService);
      setDrafts(normalized);
    } catch (error) {
      console.log(error)
      setSnackMessage('AI Generation failed');
      setSnackOpen(true);
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
      const dto = formatForBackend(service);
      await userService.createService(dto);
      setDrafts((prev) => prev.filter((d) => d.id !== service.id));
      setIsModalOpen(false);
      setSnackMessage('Service saved successfully!');
      setSnackOpen(true);
    } catch {
      setSnackMessage('Duplicate name)');
      setSnackOpen(true);
    }
  };

  const handleSaveAll = async () => {
    try {
      const promises = drafts.map((d) =>
        userService.createService(formatForBackend(d))
      );
      await Promise.all(promises);
      setDrafts([]);
      setSnackMessage('All services have been successfully imported!');
      setSnackOpen(true);
    } catch {
      setSnackMessage('Check for duplicate names');
      setSnackOpen(true);
    }
  };

  return (
    <main className={catalogStyles.main}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />

      <section className={catalogStyles.catalog}>
        <div className={`${catalogStyles.container} page-container ai-page-column`}>
          <div className="ai-input-wrapper">
            <TextField
              className="ai-text-field"
              fullWidth
              multiline
              placeholder="Enter your query..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
            />
            <Button
              variant="contained"
              onClick={handleGenerate}
              className="ai-generate-button"
            >
              <AutoAwesomeIcon />
            </Button>
          </div>

          {drafts.length > 0 && (
            <div className="ai-actions-row">
              <Button
                variant="contained"
                className="ai-save-all-btn"
                onClick={handleSaveAll}
                startIcon={<SaveIcon />}
              >
                Save All to Server
              </Button>
            </div>
          )}

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
                  setDrafts((prev) => prev.filter((d) => d.id !== draft.id))
                }
              />
            ))}
          </div>

          {drafts.length === 0 && (
            <p className="ai-empty-text">
              Generate services with AI to start editing
            </p>
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
