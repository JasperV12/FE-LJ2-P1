import { useState } from 'react';
import { Link } from 'react-router-dom';
import TeamCard from '../components/TeamCard';

export default function Teams({ 
  teams, 
  onCreateTeam, 
  onDeleteTeam, 
  onRemoveMember 
}) {
  const [newTeamName, setNewTeamName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = newTeamName.trim();
    if (!trimmed) {
      setErrorMessage('Vul a.u.b. een afdelings- of teamnaam in.');
      return;
    }

    onCreateTeam(trimmed);
    setNewTeamName('');
    setErrorMessage('');
  }

  return (
    <div className="page teams-page">
      <div className="page-header">
        <h1>Afdelingen & Teams</h1>
        <p>Organiseer uw personeel in doelgerichte teams van maximaal 6 Pokémon per afdeling.</p>
      </div>

      <div className="create-team-card">
        <h2>Nieuwe Afdeling Oprichten</h2>
        <form onSubmit={handleSubmit} className="create-team-form">
          <input 
            type="text" 
            placeholder="Bijv. Marketing, HR, Debiteurenbeheer..." 
            value={newTeamName}
            onChange={(e) => {
              setNewTeamName(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            className="input-field"
          />
          <button type="submit" className="btn btn-primary">
            + Team Aanmaken
          </button>
        </form>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </div>

      <div className="teams-list-section">
        <h2>Bestaande Afdelingen ({teams.length})</h2>

        {teams.length === 0 ? (
          <div className="empty-state">
            <p>Er zijn op dit moment geen actieve kantoorteams.</p>
            <p>Gebruik het formulier hierboven om uw eerste team samen te stellen.</p>
          </div>
        ) : (
          <div className="teams-vertical-list">
            {teams.map((team) => (
              <div key={team.id} className="team-item-wrapper">
                <TeamCard 
                  team={team} 
                  onDeleteTeam={onDeleteTeam} 
                  onRemoveMember={onRemoveMember}
                  readOnly={false}
                />
                {team.members.length < 6 && (
                  <div className="team-add-prompt">
                    <Link to="/pokemon" className="link-inline">
                      + Voeg personeelslid toe vanuit de catalogus ({6 - team.members.length} plekken over)
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

