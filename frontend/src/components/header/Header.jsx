import { useState } from "react";
import logo from "../assets/estate360-logo.jpg";
import "./Header.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "estates", label: "Estates" },
  { id: "workers", label: "Workers" },
  { id: "attendance", label: "Attendance" },
  { id: "harvest", label: "Harvest" },
  { id: "payroll", label: "Payroll" },
  { id: "iot", label: "IoT" },
  { id: "analytics", label: "Analytics" },
];

function Header({
  userName = "User",
  userRole = "Owner",
  estateName = "Estate",
  alertCount = 0,
  iotOnline = true,
  onNavigate,
}) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (itemId) => {
    setActiveItem(itemId);
    setMenuOpen(false);
    onNavigate?.(itemId);
  };

  return (
    <header className="e360-header">
      <div className="e360-header__bar">
        <a
          className="e360-header__brand"
          href="#dashboard"
          onClick={(event) => {
            event.preventDefault();
            handleNavigate("dashboard");
          }}
        >
          <img
            className="e360-header__logo"
            src={logo}
            alt="Estate360 — Manage. Monitor. Maximize."
          />
        </a>

        <button
          className="e360-header__toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="e360-primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav
          id="e360-primary-nav"
          className={`e360-header__nav${menuOpen ? " is-open" : ""}`}
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={
                activeItem === item.id
                  ? "e360-header__link is-active"
                  : "e360-header__link"
              }
              onClick={(event) => {
                event.preventDefault();
                handleNavigate(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="e360-header__actions">
          <span
            className={`e360-header__iot${iotOnline ? " is-online" : " is-offline"}`}
          >
            <span className="e360-header__dot" aria-hidden="true" />
            IoT {iotOnline ? "live" : "offline"}
          </span>

          <span className="e360-header__estate" title="Current estate scope">
            {estateName}
          </span>

          <button className="e360-header__alerts" type="button">
            Alerts
            {alertCount > 0 ? (
              <span className="e360-header__badge">{alertCount}</span>
            ) : null}
          </button>

          <div className="e360-header__user">
            <span className="e360-header__avatar" aria-hidden="true">
              {userName.slice(0, 1)}
            </span>
            <span className="e360-header__user-copy">
              <strong>{userName}</strong>
              <small>{userRole}</small>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
