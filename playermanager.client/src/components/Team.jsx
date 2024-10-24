import PropTypes from 'prop-types';
const Team = ({ team, onRemoveFromTeam }) => {
    return (
        <div>
            <h2>Assembled Team (Max 5)</h2>
            <ul>
                {team.map((player) => (
                    <li key={player.id}>
                        <strong>{player.name}</strong> - {player.position}
                        <button onClick={() => onRemoveFromTeam(player)}>{'<<'}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Define prop types
Team.propTypes = {
    team: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            skills: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    value: PropTypes.number.isRequired
                })
            )
        })
    ).isRequired,
    onRemoveFromTeam: PropTypes.func.isRequired
};

export default Team;
