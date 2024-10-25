import PropTypes from 'prop-types';
import './TeamList.css';

const TeamList = ({ teamMembers, removeFromTeam, assembleBestTeam }) => {
    return (
        <div className="teamListContainer">
            <div className="teamHeader">
                <h2>Team Members</h2>
                <button className="button" style={{ marginLeft: '10px' }} onClick={assembleBestTeam}>
                    Assemble Best Team
                </button>
            </div>
            <ul>
                {teamMembers.map((member) => (
                    <li key={member.id} className="teamMemberRow">
                        <span className="teamMemberName">{member.name} - {member.position}</span>
                        <button onClick={() => removeFromTeam(member)} className="removeButton">X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Define prop types for better type checking
TeamList.propTypes = {
    teamMembers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
        })
    ).isRequired,
    removeFromTeam: PropTypes.func.isRequired,
    assembleBestTeam: PropTypes.func.isRequired,
};

export default TeamList;
