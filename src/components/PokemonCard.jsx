import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PokemonCard({ 
  id, 
  name, 
  image, 
  types = [], 
  isFavorite = false, 
  onToggleFavorite, 
  teams = [], 
  onAddToTeam 
}) {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const formattedId = '#' + String(id).padStart(3, '0');

  function handleAdd(e) {
    e.preventDefault();
    if (!selectedTeamId) return;
    onAddToTeam(Number(selectedTeamId), { id, name, image, types });
    setSelectedTeamId('');
  }

  return (
    <div className="pokemon-card">
      <div className="card-top">
        <span className="pokemon-number">{formattedId}</span>
        {onToggleFavorite && (
          <button 
            type="button"
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite({ id, name, image, types });
            }}
            aria-label="Favoriet"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={isFavorite ? '#ef4444' : 'none'} 
              stroke={isFavorite ? '#ef4444' : '#94a3b8'} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>

      <Link to={`/pokemon/${name}`} className="card-link">
        <div className="card-image-wrap">
          <img src={image} alt={name} className="pokemon-image" loading="lazy" />
        </div>
        <h3 className="pokemon-name">{name}</h3>
      </Link>

      <div className="pokemon-types">
        {types.map((typeObj) => {
          const typeName = typeof typeObj === 'string' ? typeObj : typeObj.type?.name;
          return (
            <span key={typeName} className={`type-badge type-${typeName}`}>
              {typeName}
            </span>
          );
        })}
      </div>

      {teams.length > 0 && onAddToTeam && (
        <form onSubmit={handleAdd} className="card-team-action">
          <select 
            value={selectedTeamId} 
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="team-select"
          >
            <option value="">Kies team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.members.length}/6)
              </option>
            ))}
          </select>
          <button type="submit" disabled={!selectedTeamId} className="btn-add">
            <span className="btn-add-icon">+</span>
          </button>
        </form>
      )}
    </div>
  );
}
