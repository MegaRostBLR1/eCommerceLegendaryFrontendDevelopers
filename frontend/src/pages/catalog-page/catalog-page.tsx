import { Pagination } from '@mui/material';
import { Card } from '../../components/card/card';
import styles from './catalog-page.module.css';
import { PAGINATION_STYLE } from './constants';
import { SelectComponent } from './ui/select-component/select-component';
import { SearchInput } from './ui/search-input/search-input';

const DATA = [
  {
    title: 'Разработка лендинга',
    price: 15000,
    description:
      'Создание продающей страницы с уникальным дизайном и адаптивной версткой под все устройства.',
    id: 1,
    discount: 14,
    employeesCount: 2,
    duration: '3-5 дней',
    category: 'Веб-разработка',
  },
  {
    title: 'Логотип бренда',
    price: 5000,
    description:
      'Разработка фирменного стиля, включая три варианта логотипа и подбор цветовой палитры.',
    id: 2,
    discount: 12,
    employeesCount: 1,
    duration: '2 дня',
    category: 'Дизайн',
  },
  {
    title: 'SEO Оптимизация',
    price: 10000,
    description:
      'Базовая настройка мета-тегов, анализ ключевых слов и улучшение индексации вашего ресурса.',
    id: 3,
    discount: 15,
    employeesCount: 1,
    duration: '7 дней',
    category: 'Маркетинг',
  },
  {
    title: 'Мобильное приложение',
    price: 100000,
    description:
      'Полноценная разработка под iOS и Android на React Native с интеграцией серверной части и API.',
    id: 4,
    discount: 15,
    employeesCount: 4,
    duration: '30 дней',
    category: 'Разработка',
  },
  {
    title: 'Контент-план',
    price: 3000,
    description:
      'Составление стратегии публикаций на месяц вперед для ваших социальных сетей.',
    id: 12,
    discount: 1.5,
    employeesCount: 1,
    duration: '4 часа',
    category: 'SMM',
  },
  {
    title: 'Настройка рекламы',
    price: 8000,
    description:
      'Запуск контекстной рекламы в поисковых системах с оптимизацией стоимости клика.',
    id: 22,
    discount: 1.1,
    employeesCount: 2,
    duration: '3 дня',
    category: 'Маркетинг',
  },
  {
    title: 'Поддержка сайта',
    price: 5000,
    description:
      'Техническое обслуживание сайта, исправление ошибок и регулярное обновление контента. ошибок и регулярное обновление контентаошибок и регулярное обновление контентаошибок и регулярное обновление контентаошибок и регулярное обновление контента',
    id: 32,
    discount: 0,
    employeesCount: 1,
    duration: 'Ежемесячно',
    category: 'IT-услуги',
  },
];

const DEV_URL = import.meta.env.VITE_DEV_URL;

console.log(DEV_URL);

export const CatalogPage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.catalog}>
        <div className={styles.container + ' page-container'}>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>services</h1>
            <div className={styles.content}>
              <div className={styles.filters}>
                <div className={styles.categories}>
                  <SelectComponent />
                </div>
                <div className={styles.search}>
                  <SearchInput />
                </div>
              </div>
              <div className={styles.cards}>
                {DATA.map((item) => (
                  <Card
                    key={item.id}
                    title={item.title}
                    price={item.price}
                    description={item.description}
                    discount={item.discount}
                    employeesCount={item.employeesCount}
                    duration={item.duration}
                    category={item.category}
                  />
                ))}
              </div>
              <Pagination
                count={4}
                onChange={(_, page) => console.log(page)}
                variant="outlined"
                shape="rounded"
                sx={PAGINATION_STYLE}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
