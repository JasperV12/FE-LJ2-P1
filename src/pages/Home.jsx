import { Link } from 'react-router-dom';
import TeamCard from '../components/TeamCard';

export default function Home({ teams, favorites, totalPokemonCount }) {
  return (
    <div className="page home-page">
      <section className="stats-section">
        <h2 className="section-title">Bedrijfsoverzicht</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Aantal Teams</span>
            <span className="stat-value">{teams.length}</span>
            <span className="stat-sub">Actieve afdelingen</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Favorieten</span>
            <span className="stat-value">{favorites.length}</span>
            <span className="stat-sub">Geselecteerde toppers</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Beschikbare Pokémon</span>
            <span className="stat-value">{totalPokemonCount || 151}</span>
            <span className="stat-sub">In de database</span>
          </div>
        </div>
      </section>

      <section className="quick-access-section">
        <h2 className="section-title">Snelle Toegang</h2>
        <div className="quick-access-grid">
          <Link to="/pokemon" className="quick-card">
            <div className="quick-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div className="quick-card-text">
              <h3>Blader door Pokémon</h3>
              <p>Zoek, filter en bekijk details van alle beschikbare werknemers.</p>
            </div>
            <span className="quick-card-arrow">&rarr;</span>
          </Link>

          <Link to="/teams" className="quick-card">
            <div className="quick-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="quick-card-text">
              <h3>Beheer Kantoorteams</h3>
              <p>Maak nieuwe afdelingen aan of wijzig bestaande teamsamenstellingen.</p>
            </div>
            <span className="quick-card-arrow">&rarr;</span>
          </Link>
        </div>
      </section>

      <section className="recent-teams-section">
        <div className="section-header-flex">
          <h2 className="section-title">Recente Teams (Preview)</h2>
          <Link to="/teams" className="link-more">Alle teams bekijken &rarr;</Link>
        </div>

        {teams.length === 0 ? (
          <div className="empty-state">
            <p>Er zijn nog geen teams aangemaakt.</p>
            <Link to="/teams" className="btn btn-primary">Maak uw eerste team aan</Link>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.slice(0, 3).map((team) => (
              <TeamCard key={team.id} team={team} readOnly={true} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
