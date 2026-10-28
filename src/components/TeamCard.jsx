import { Link } from 'react-router-dom';

export default function TeamCard({ 
  team, 
  onDeleteTeam, 
  onRemoveMember, 
  readOnly = false 
}) {
  const slots = Array.from({ length: 6 }, (_, index) => team.members[index] || null);

  return (
    <div className="team-card">
      <div className="team-card-header">
        <div>
          <h3 className="team-name">{team.name}</h3>
          <span className="team-count">{team.members.length} / 6 Pokémon</span>
        </div>
        {!readOnly && onDeleteTeam && (
          <button 
            type="button" 
            className="btn-danger"
            onClick={() => onDeleteTeam(team.id)}
          >
            Verwijder team
          </button>
        )}
      </div>

      <div className="team-members-grid">
        {slots.map((member, index) => (
          <div key={index} className={`team-member-slot ${member ? 'filled' : 'empty'}`}>
            {member ? (
              <div className="member-info">
                <Link to={`/pokemon/${member.name}`} className="member-link">
                  <img src={member.image} alt={member.name} className="member-sprite" />
                  <span className="member-name">{member.name}</span>
                </Link>
                {!readOnly && onRemoveMember && (
                  <button
                    type="button"
                    className="btn-remove-member"
                    onClick={() => onRemoveMember(team.id, member.id)}
                    title="Verwijder uit team"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="empty-slot">
                <span className="empty-slot-plus">+</span>
                <span className="empty-slot-text">Leeg</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
