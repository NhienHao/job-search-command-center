import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { fetchHealth } from "../api/client";

export function Layout() {
  const [apiStatus, setApiStatus] = useState<string>("checking…");

  useEffect(() => {
    fetchHealth()
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus("unreachable"));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Job Search Command Center</h1>
        <nav>
          <Link to="/">Applications</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="api-status">
        API status: <strong>{apiStatus}</strong>
      </footer>
    </div>
  );
}
