import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../components/footer/Footer';

describe('Footer Component', () => {
  it('should render the team logo and name', () => {
    render(<Footer />);

    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
    expect(screen.getByText(/Legendary/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend/i)).toBeInTheDocument();
  });

  it('should render developer links and names', () => {
    render(<Footer />);

    const developersHeader = screen.getByText(/Developers/i);
    expect(developersHeader).toBeInTheDocument();

    expect(screen.getByText('bssier')).toBeInTheDocument();
    expect(screen.getByText('MegaRostBLR1')).toBeInTheDocument();
    expect(screen.getByText('Rorodeathless1')).toBeInTheDocument();
    expect(screen.getByText('Morevna')).toBeInTheDocument();
    expect(screen.getByText('andrski')).toBeInTheDocument();

    const allLinks = screen.getAllByRole('link');
    expect(allLinks).toHaveLength(7);
  });

  it('should render RS School and Repository links', () => {
    render(<Footer />);

    const rsLink = screen.getByRole('link', { name: /RS School/i });
    const repoLink = screen.getByRole('link', { name: /The Repository/i });

    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
    expect(repoLink).toHaveAttribute(
      'href',
      expect.stringContaining('github.com')
    );
  });

  it('all links should open in a new tab with correct security attributes', () => {
    render(<Footer />);

    const allLinks = screen.getAllByRole('link');

    allLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
    });
  });

  it('should have the correct CSS wrapper class and footer tag', () => {
    const { container } = render(<Footer />);

    const wrapper = container.querySelector('.footer-wrapper');
    const footerTag = container.querySelector('footer');

    expect(wrapper).toBeInTheDocument();
    expect(footerTag).toBeInTheDocument();
  });
});
