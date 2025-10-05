import { useEffect, useMemo, useState } from "react";
import "./styles.css";

interface User {
  id: number;
  name: string;
  email: string;
  address: { city: string };
  company: { name: string };
  phone: string;
  website: string;
}

export default function App() {
  // Data & status
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");

  // Fetch users on mount
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: User[] = await res.json();

        // delay to show the Load handling
        await new Promise((r) => setTimeout(r, 3000));

        setUsers(data);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError(err?.message ?? "Failed to load users");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, []);

  // Dropdown options
  const cityOptions = useMemo(
    () => Array.from(new Set(users.map((u) => u.address.city))).sort(),
    [users]
  );
  const companyOptions = useMemo(
    () => Array.from(new Set(users.map((u) => u.company.name))).sort(),
    [users]
  );

  // Apply AND logic across filters
  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    return users.filter((u) => {
      const byName = s ? u.name.toLowerCase().includes(s) : true;
      const byCity = city ? u.address.city === city : true;
      const byCompany = company ? u.company.name === company : true;
      return byName && byCity && byCompany;
    });
  }, [users, search, city, company]);

  function clearAll() {
    setSearch("");
    setCity("");
    setCompany("");
  }

  const resultsId = "user-results";

  return (
    <main id="main-content" className="container">
      <header className="page-header" role="banner" aria-label="Header">
        <h1 className="visually-hidden">Users Directory</h1>
        <h2 aria-hidden="true">Users</h2>
      </header>

      {/* Screen-reader live region */}
      <div
        className="sr-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {loading && "Loading users…"}
        {error && `Failed to fetch users: ${error}`}
      </div>

      {/* Filters */}
      <form
        className="filters"
        aria-describedby="filters-help"
        aria-controls={resultsId}
      >
        <fieldset>
          <legend className="legend">Filters</legend>

          <div className="field">
            <label htmlFor="search">Search name</label>
            <input
              id="search"
              name="search"
              type="search"
              inputMode="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g., Leanne"
              aria-label="Search users by name"
            />
          </div>

          <div className="field">
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="company">Company</label>
            <select
              id="company"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="">All companies</option>
              {companyOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="clearBtn"
            onClick={clearAll}
            disabled={!search && !city && !company}
            aria-disabled={!search && !city && !company}
          >
            Clear all filters
          </button>

          <p id="filters-help" className="help">
            Filters use AND logic. Type or select options to narrow results.
          </p>
        </fieldset>
      </form>

      <section>
        <p className="count" aria-live="polite">
          Showing <strong>{filteredUsers.length}</strong> of{" "}
          <strong>{users.length}</strong> users
        </p>

        {loading && (
          <p
            className="status"
            aria-busy="true"
            style={{ marginTop: "0.5rem" }}
          >
            ⏳ Loading…
          </p>
        )}
      </section>

      {/* Error */}
      {error && (
        <div className="status error" role="alert">
          ⚠️ Failed to fetch users: {error}
        </div>
      )}

      {/* Results */}
      {!loading && !error && filteredUsers.length > 0 && (
        <ul id={resultsId} className="grid" role="list">
          {filteredUsers.map((u) => {
            const site = u.website.startsWith("http")
              ? u.website
              : `https://${u.website}`;
            return (
              <li key={u.id}>
                <article className="card" aria-labelledby={`user-${u.id}-h`}>
                  <h3 id={`user-${u.id}-h`} className="card-title">
                    {u.name}
                  </h3>
                  <p>
                    <span className="label">Email:</span>{" "}
                    <a href={`mailto:${u.email}`}>{u.email}</a>
                  </p>
                  <p>
                    <span className="label">City:</span> {u.address.city}
                  </p>
                  <p>
                    <span className="label">Company:</span> {u.company.name}
                  </p>
                  <p>
                    <span className="label">Phone:</span>{" "}
                    <a href={`tel:${u.phone}`}>{u.phone}</a>
                  </p>
                  <p>
                    <span className="label">Website:</span>{" "}
                    <a href={site} target="_blank" rel="noreferrer noopener">
                      {u.website}
                    </a>
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && !error && users.length > 0 && filteredUsers.length === 0 && (
        <div className="status" role="status" aria-live="polite">
          ℹ️ No results found. Try clearing filters.
        </div>
      )}
    </main>
  );
}
