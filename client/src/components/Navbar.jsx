export function Navbar({ currentPage, onNavigate }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "create", label: "Create" },
  ];

  return (
    <nav className="navbar">
      <button
        type="button"
        className="navbar-brand"
        onClick={() => onNavigate("home")}
      >
        <span className="brand-icon" aria-hidden="true">
          📚
        </span>
        Study Assistant
      </button>

      <div className="navbar-links">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={`nav-link ${currentPage === link.id ? "active" : ""}`}
            onClick={() => onNavigate(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
