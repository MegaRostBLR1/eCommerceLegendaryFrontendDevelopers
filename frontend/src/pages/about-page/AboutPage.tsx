import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { IconButton, Tooltip } from '@mui/material';
import { ABOUT_TEXT } from './AboutData';
import './AboutPage.css';

interface AboutSectionProps {
  title?: string;
  paragraphs: string[];
  className?: string;
  headerTag?: 'h1' | 'h2';
}

const AboutSection = ({
  title,
  paragraphs,
  className,
  headerTag: Header = 'h2',
}: AboutSectionProps) => (
  <div className={className}>
    {title && <Header className="column-header">{title}</Header>}
    {paragraphs.map((text, index) => (
      <p key={index}>{text}</p>
    ))}
  </div>
);

export const AboutPage = () => {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  const toggleLang = () => setLang((prev) => (prev === 'ru' ? 'en' : 'ru'));
  const t = ABOUT_TEXT[lang];

  return (
    <div className="about-page">
      <div className="lang-switcher">
        <Tooltip
          title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
        >
          <IconButton onClick={toggleLang} color="inherit">
            <LanguageIcon />
            <span style={{ fontSize: '14px', marginLeft: '5px' }}>
              {lang.toUpperCase()}
            </span>
          </IconButton>
        </Tooltip>
      </div>

      <div className="about-container">
        <h1 className="about-title">{t.title}</h1>

        <AboutSection paragraphs={t.intro} className="about-intro" />

        <div className="about-split">
          <AboutSection
            title={t.userSide.header}
            paragraphs={t.userSide.content}
            className="about-column user-side"
          />

          <AboutSection
            title={t.adminSide.header}
            paragraphs={t.adminSide.content}
            className="about-column admin-side"
          />
        </div>
      </div>
    </div>
  );
};
