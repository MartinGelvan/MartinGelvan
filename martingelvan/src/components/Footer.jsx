import "../css/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} Hecho con por
          <strong> Martin Gelvan</strong>
        </p>
        <div className="footer-links">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="mailto:martin@example.com">Contacto</a>
        </div>
      </div>
    </footer>
  );
};
