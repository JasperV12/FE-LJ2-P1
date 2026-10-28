import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import PokemonList from './pages/PokemonList';
import PokemonDetail from './pages/PokemonDetail';
import Teams from './pages/Teams';
import Favorites from './pages/Favorites';
import './App.css';

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('pokecorp_teams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokecorp_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pokecorp_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('pokecorp_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        setLoading(true);
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await res.json();
        
        const detailedList = await Promise.all(
          data.results.map(async (item) => {
            const singleRes = await fetch(item.url);
            const singleData = await singleRes.json();
            return {
              id: singleData.id,
              name: singleData.name,
              image: singleData.sprites.front_default,
              types: singleData.types.map((t) => t.type.name)
            };
          })
        );

        setPokemonList(detailedList);
      } catch {
        setPokemonList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllPokemon();
  }, []);

  function handleCreateTeam(teamName) {
    const newTeam = {
      id: Date.now(),
      name: teamName,
      members: []
    };
    setTeams([...teams, newTeam]);
  }

  function handleDeleteTeam(teamId) {
    setTeams(teams.filter((team) => team.id !== teamId));
  }

  function handleAddToTeam(teamId, pokemon) {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return { success: false, message: 'Team niet gevonden' };

    if (targetTeam.members.length >= 6) {
      return { success: false, message: 'Dit team zit al vol (maximaal 6 Pokémon).' };
    }

    const alreadyInTeam = targetTeam.members.some((m) => m.id === pokemon.id);
    if (alreadyInTeam) {
      return { success: false, message: `${pokemon.name} zit al in dit team.` };
    }

    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            members: [...team.members, pokemon]
          };
        }
        return team;
      })
    );

    return { success: true, message: `${pokemon.name} succesvol toegevoegd aan ${targetTeam.name}!` };
  }

  function handleRemoveMember(teamId, pokemonId) {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter((member) => member.id !== pokemonId)
          };
        }
        return team;
      })
    );
  }

  function handleRenameMember(teamId, pokemonId, nickname) {
    setTeams(
      teams.map((team) => {
        if (team.id !== teamId) return team;

        return {
          ...team,
          members: team.members.map((member) => (
            member.id === pokemonId
              ? { ...member, nickname }
              : member
          ))
        };
      })
    );
  }

  function handleToggleFavorite(pokemon) {
    const exists = favorites.some((f) => f.id === pokemon.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== pokemon.id));
    } else {
      setFavorites([...favorites, pokemon]);
    }
  }

  return (
    <div className="app-layout">
      <Navigation />
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                teams={teams} 
                favorites={favorites} 
                totalPokemonCount={pokemonList.length} 
              />
            } 
          />
          <Route 
            path="/pokemon" 
            element={
              <PokemonList 
                pokemonList={pokemonList}
                loading={loading}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                teams={teams}
                onAddToTeam={handleAddToTeam}
              />
            } 
          />
          <Route path="/list" element={<Navigate to="/pokemon" replace />} />
          <Route 
            path="/pokemon/:name" 
            element={
              <PokemonDetail 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                teams={teams}
                onAddToTeam={handleAddToTeam}
                onRenameMember={handleRenameMember}
              />
            } 
          />
          <Route 
            path="/detail/:name" 
            element={
              <PokemonDetail 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                teams={teams}
                onAddToTeam={handleAddToTeam}
                onRenameMember={handleRenameMember}
              />
            } 
          />
          <Route 
            path="/teams/:teamId/pokemon/:memberId" 
            element={
              <PokemonDetail 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                teams={teams}
                onAddToTeam={handleAddToTeam}
                onRenameMember={handleRenameMember}
              />
            } 
          />
          <Route 
            path="/teams" 
            element={
              <Teams 
                teams={teams}
                onCreateTeam={handleCreateTeam}
                onDeleteTeam={handleDeleteTeam}
                onRemoveMember={handleRemoveMember}
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <Favorites 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                teams={teams}
                onAddToTeam={handleAddToTeam}
              />
            } 
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
