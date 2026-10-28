import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PokemonDetail({ 
  favorites = [], 
  onToggleFavorite, 
  teams = [], 
  onAddToTeam,
  onRenameMember
}) {
  const { name, teamId, memberId } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [nicknameStatusMessage, setNicknameStatusMessage] = useState('');
  const teamMember = teamId && memberId
    ? teams.find((team) => String(team.id) === teamId)?.members.find(
      (member) => String(member.id) === memberId
    )
    : null;
  const pokemonName = teamMember?.name || name;

  useEffect(() => {
    async function fetchPokemonDetail() {
      try {
        setLoading(true);
        setError(null);
        if (!pokemonName) {
          throw new Error('Teamlid niet gevonden');
        }
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        if (!res.ok) {
          throw new Error('Pokémon niet gevonden');
        }
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonDetail();
  }, [pokemonName]);

  if (loading) {
    return (
      <div className="page detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Pokémongegevens laden...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="page detail-page">
        <div className="empty-state">
          <h2>Geen gegevens gevonden</h2>
          <p>{error || 'Onbekende Pokémon'}</p>
          <Link to="/pokemon" className="btn btn-primary">Terug naar overzicht</Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some((f) => f.id === pokemon.id);
  const formattedId = '#' + String(pokemon.id).padStart(3, '0');
  const artwork = 
    pokemon.sprites.other?.['official-artwork']?.front_default || 
    pokemon.sprites.front_default;

  const totalStats = pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

  function handleRename(e) {
    e.preventDefault();
    const nickname = new FormData(e.currentTarget).get('nickname').trim();
    onRenameMember(Number(teamId), Number(memberId), nickname);
    setNicknameStatusMessage(nickname ? 'Bijnaam opgeslagen.' : 'Bijnaam verwijderd.');
    setTimeout(() => setNicknameStatusMessage(''), 3000);
  }

  function handleAssignToTeam(e) {
    e.preventDefault();
    if (!selectedTeamId) return;

    const memberData = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.front_default,
      types: pokemon.types.map((t) => t.type.name)
    };

    const result = onAddToTeam(Number(selectedTeamId), memberData);
    if (result && result.message) {
      setStatusMessage(result.message);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  }

  return (
    <div className="page detail-page">
      <div className="breadcrumb">
        <Link to={teamMember ? '/teams' : '/pokemon'} className="breadcrumb-back">
          &larr; Terug naar {teamMember ? 'teams' : 'Pokémon'}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">
          {formattedId} {teamMember?.nickname || pokemon.name}
        </span>
      </div>

      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-image-box">
            <img src={artwork} alt={pokemon.name} className="detail-image" />
          </div>

          <div className="detail-info-card">
            <h3>Pokémongegevens</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td>Naam</td>
                  <td className="capitalize">
                    {teamMember?.nickname || pokemon.name}
                    {teamMember?.nickname && <span className="detail-species"> ({pokemon.name})</span>}
                  </td>
                </tr>
                <tr>
                  <td>Nummer</td>
                  <td>{formattedId}</td>
                </tr>
                <tr>
                  <td>Type(s)</td>
                  <td>
                    <div className="types-row">
                      {pokemon.types.map((t) => (
                        <span key={t.type.name} className={`type-badge type-${t.type.name}`}>
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Lengte</td>
                  <td>{(pokemon.height / 10).toFixed(1)} m</td>
                </tr>
                <tr>
                  <td>Gewicht</td>
                  <td>{(pokemon.weight / 10).toFixed(1)} kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="detail-actions-card">
            <h3>Acties</h3>
            <button 
              type="button" 
              className={`btn ${isFavorite ? 'btn-favorite-active' : 'btn-secondary'} btn-with-icon`}
              onClick={() => onToggleFavorite({
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.front_default,
                types: pokemon.types.map((t) => t.type.name)
              })}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? '#ef4444' : 'none'} 
                stroke={isFavorite ? '#ef4444' : 'currentColor'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}</span>
            </button>

            {teams.length > 0 && (
              <form onSubmit={handleAssignToTeam} className="detail-team-form">
                <label htmlFor="team-select">Voeg toe aan team:</label>
                <div className="form-row">
                  <select
                    id="team-select"
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="team-select"
                  >
                    <option value="">Kies een team...</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.members.length}/6)
                      </option>
                    ))}
                  </select>
                  <button type="submit" disabled={!selectedTeamId} className="btn btn-primary">
                    Toevoegen
                  </button>
                </div>
                {statusMessage && (
                  <p className="status-feedback">{statusMessage}</p>
                )}
              </form>
            )}

            {teamMember && (
              <form onSubmit={handleRename} className="nickname-form">
                <label htmlFor="pokemon-nickname">Bijnaam voor dit teamlid:</label>
                <div className="form-row">
                  <input
                    id="pokemon-nickname"
                    name="nickname"
                    type="text"
                    maxLength="24"
                    defaultValue={teamMember.nickname || ''}
                    placeholder={`Bijv. ${pokemon.name}`}
                    className="input-field"
                  />
                  <button type="submit" className="btn btn-primary">Opslaan</button>
                </div>
                {nicknameStatusMessage && <p className="status-feedback">{nicknameStatusMessage}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="detail-right">
          <div className="detail-stats-card">
            <h3>Capaciteiten & Statistieken</h3>
            <div className="stats-bars">
              {pokemon.stats.map((s) => {
                const percentage = Math.min(Math.round((s.base_stat / 180) * 100), 100);
                return (
                  <div key={s.stat.name} className="stat-row">
                    <span className="stat-name">{s.stat.name.replace('-', ' ')}</span>
                    <div className="stat-bar-track">
                      <div 
                        className="stat-bar-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="stat-number">{s.base_stat}</span>
                  </div>
                );
              })}
            </div>
            <div className="stat-total-row">
              <strong>Totaal Score:</strong>
              <strong>{totalStats}</strong>
            </div>
          </div>

          <div className="detail-abilities-card">
            <h3>Vaardigheden</h3>
            <div className="abilities-grid">
              {pokemon.abilities.map((a) => (
                <div key={a.ability.name} className="ability-card">
                  <span className="ability-name">{a.ability.name.replace('-', ' ')}</span>
                  {a.is_hidden && <span className="ability-hidden-badge">Verborgen talent</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
