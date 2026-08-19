import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page centered-page">
      <div className="result-card">
        <div className="result-icon">404</div>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="primary-link" to="/">
          Go home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
