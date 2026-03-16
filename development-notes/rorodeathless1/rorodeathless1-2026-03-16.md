# Дата: 2026-03-16

- **Что было сделано:** сделал 5 тестов, разобрал код тимейтов .
- **Мысли / Планы:** подключить ИИ, для создания карточек
- **Затраченное время:** 4 часов

  1.Михаил создавал footer. мне понравилась чистота кода. это можно увидеть в footer.tsx

```javascript
const developers: Developer[] = [
{ name: 'bssier', ghLink: 'https://github.com/bssier' },
{
  name: 'MegaRostBLR1',
  ghLink: 'https://github.com/megarostblr1',
},
{
  name: 'Rorodeathless1',
  ghLink: 'https://github.com/rorodeathless1',
},
{
  name: 'Morevna',
  ghLink: 'https://github.com/morevna',
},
{
  name: 'andrski',
  ghLink: 'https://github.com/andrski',
},
];
```

2.Миша, использует методы массива, что убирает дублирование кода - это круто.

```javascript
   <div className={'information-links-container'}>
          {informationLinks.map((link: InformationLink) => (
            <a
              key={link.link}
              target={'_blank'}
              href={link.link}
              className={'information-link'}
              rel="noreferrer"
            >
              {link.linkName}
            </a>
          ))}
        </div>
```

3. круто что Миша импортирует svg с другого файла, чтобы строчек кода и захламленность кода была лучше

```javascript
import logo from "../../assets/icons/logo.svg";
```
