import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';

const POKEMON_TYPES = [
  'all',
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'steel',
  'fairy'
];

export default function PokemonList({ 
  pokemonList, 
  loading, 
  favorites, 
  onToggleFavorite, 
  teams, 
  onAddToTeam 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredPokemon = useMemo(() => {
    return pokemonList.filter((pokemon) => {
      const matchesSearch = 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(pokemon.id).includes(searchTerm);

      const matchesType = 
        selectedType === 'all' || 
        pokemon.types.some((t) => {
          const typeName = typeof t === 'string' ? t : t.type?.name;
          return typeName === selectedType;
        });

      return matchesSearch && matchesType;
    });
  }, [pokemonList, searchTerm, selectedType]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  return (
    <div className="page pokemon-list-page">
      <div className="page-header">
        <h1>Pokémon</h1>
        <p>Ontdek Pokémon en filter op naam, nummer of type.</p>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Zoek op naam of nummer..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <label htmlFor="type-filter" className="filter-label">Type:</label>
          <select 
            id="type-filter"
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            {POKEMON_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'Alle types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="list-layout">
        <main className="list-main">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Pokémon gegevens worden geladen...</p>
            </div>
          ) : filteredPokemon.length === 0 ? (
            <div className="empty-state">
              <p>Geen Pokémon gevonden die voldoen aan uw zoekopdracht.</p>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { setSearchTerm(''); setSelectedType('all'); }}
              >
                Filters wissen
              </button>
            </div>
          ) : (
            <div className="pokemon-grid">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  id={pokemon.id}
                  name={pokemon.name}
                  image={pokemon.image}
                  types={pokemon.types}
                  isFavorite={favoriteIds.has(pokemon.id)}
                  onToggleFavorite={onToggleFavorite}
                  teams={teams}
                  onAddToTeam={onAddToTeam}
                />
              ))}
            </div>
          )}
        </main>

        <aside className="list-sidebar">
          <div className="sidebar-box">
            <div className="sidebar-box-header">
              <h3>Favorieten ({favorites.length})</h3>
              <Link to="/favorites" className="sidebar-link">Alles</Link>
            </div>
            {favorites.length === 0 ? (
              <p className="sidebar-empty">Klik op het hartje bij een Pokémon om deze als favoriet op te slaan.</p>
            ) : (
              <ul className="sidebar-mini-list">
                {favorites.slice(0, 5).map((fav) => (
                  <li key={fav.id}>
                    <Link to={`/pokemon/${fav.name}`} className="mini-item">
                      <img src={fav.image} alt={fav.name} />
                      <span>{fav.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sidebar-box">
            <div className="sidebar-box-header">
              <h3>Actieve Teams ({teams.length})</h3>
              <Link to="/teams" className="sidebar-link">Beheer</Link>
            </div>
            {teams.length === 0 ? (
              <p className="sidebar-empty">Er zijn nog geen teams aangemaakt.</p>
            ) : (
              <ul className="sidebar-teams-list">
                {teams.map((team) => (
                  <li key={team.id} className="sidebar-team-item">
                    <span className="team-item-name">{team.name}</span>
                    <span className="team-item-badge">{team.members.length}/6</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
