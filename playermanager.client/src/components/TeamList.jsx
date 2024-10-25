import PropTypes from 'prop-types';
import './TeamList.css';
import { useState } from 'react';

const TeamList = ({ teamMembers, removeFromTeam, assembleBestTeam }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        setTooltipPosition({ top: clientY, left: clientX });
    };
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
                    <li key={member.id} className="teamMemberRow" onMouseMove={handleMouseMove}>
                        <span className="teamMemberName">{member.name} - {member.position}</span>
                        <button onClick={() => removeFromTeam(member)} className="removeButton">X</button>
                        {/* Tooltip content */}
                        <div className="tooltip" style={{ top: tooltipPosition.top - 20, left: tooltipPosition.left + 10 }}>
                            <strong>Skills:</strong>
                            <ul>
                                {member.skills.map((skill) => (
                                    <li key={skill.name}>
                                        {skill.name}: {skill.level}
                                    </li>
                                ))}
                            </ul>
                        </div>
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
