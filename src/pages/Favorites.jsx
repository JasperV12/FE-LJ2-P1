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
        <p>Overzicht van geselecteerde favorieten voor snelle plaatsing in kantoorteams.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>U heeft nog geen favoriete Pokémon werknemers gemarkeerd.</p>
          <p>Ga naar de Pokémon catalogus en klik op het hartje bij een kandidaat.</p>
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

