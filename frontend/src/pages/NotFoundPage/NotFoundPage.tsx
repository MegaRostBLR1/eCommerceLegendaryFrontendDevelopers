import './not-found-page.css';

export const NotFoundPage = () => (
  <div className={'not-found-page-container'}>
    <div className={'not-found-message-container'}>
      <h1>404</h1>
      <p>Oops! The page you are looking for was not found.</p>
      <a href="/">Back to main page</a>
    </div>
  </div>
);
