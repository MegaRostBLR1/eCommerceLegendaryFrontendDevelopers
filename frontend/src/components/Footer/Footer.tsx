import logo from '../../assets/logo.svg';
import './Footer.css';
import type { Developer, InformationLink } from './FooterTypes';

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

const informationLinks: InformationLink[] = [
  { linkName: 'RS School', link: 'https://rs.school/' },
  {
    linkName: 'The Repository',
    link: 'https://github.com/MegaRostBLR1/eCommerceLegendaryFrontendDevelopers/tree/feature/add-mui/frontend',
  },
];

function Footer() {
  return (
    <footer>
      <div className={'logo-container'}>
        <img src={logo} alt={'logo'}></img>
        <span className={'team-name'}>
          Legendary <br /> Frontend
        </span>
      </div>
      <div className={'developers-container'}>
        <span className={'developers-header'}>Developers</span>
        <div className={'developers-list'}>
          {developers.map((developer: Developer) => (
            <a
              target={'_blank'}
              href={developer.ghLink}
              className={'developer-link'}
            >
              {developer.name}
            </a>
          ))}
        </div>
      </div>
      <div className={'information-links-container'}>
        {informationLinks.map((link: InformationLink) => (
          <a target={'_blank'} href={link.link} className={'information-link'}>
            {link.linkName}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
