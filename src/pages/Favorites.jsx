import { Link } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';

export default function Favorites({ 
  favorites, 
  onToggleFavorite, 
  teams, 
  onAddToTeam 
}) {
  return (
    <div className="page favorites-page">
      <div className="page-header">
        <h1>Favoriete Pokémon</h1>
        <p>Je favoriete Pokémon op één plek.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>Je hebt nog geen favoriete Pokémon.</p>
          <p>Ga naar de Pokémonlijst en klik op het hartje om er een toe te voegen.</p>
          <Link to="/pokemon" className="btn btn-primary">
            Bekijk Pokémon Catalogus
          </Link>
        </div>
      ) : (
        <div className="pokemon-grid">
          {favorites.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              types={pokemon.types}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              teams={teams}
              onAddToTeam={onAddToTeam}
            />
          ))}
        </div>
      )}
    </div>
  );
}
