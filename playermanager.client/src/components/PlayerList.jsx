import PropTypes from 'prop-types';
import './PlayerList.css';
import { useState } from 'react';

const PlayerList = ({ players, onAddToTeam, onDeletePlayer, onAddPlayer, onGenerateRandomPlayers }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState({ name: '', position: '', skills: [] });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        setTooltipPosition({ top: clientY, left: clientX });
    };

    // Function to handle opening and closing the Add Player popup
    const toggleAddPlayerPopup = () => {
        setIsAddPlayerOpen(!isAddPlayerOpen);
        setNewPlayer({ name: '', position: '', skills: [] });
    };

    // Add skill to new player
    const addSkill = (skillName, skillLevel) => {
        setNewPlayer((prevPlayer) => ({
            ...prevPlayer,
            skills: [...prevPlayer.skills, { name: skillName, level: skillLevel }]
        }));
    };

    const handleAddPlayer = () => {
        onAddPlayer(newPlayer);
        toggleAddPlayerPopup(); // Close the popup after adding
    };

    const filteredPlayers = players.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="playerListContainer">
            <h2>Available Players</h2>

            {/* Add Player Button */}
            <button onClick={toggleAddPlayerPopup} className="buttonSmall">Add Player</button>
            
            <button className="buttonSmall" onClick={onGenerateRandomPlayers}>Add 100 Random Players</button>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchBox"
            />

            {/* Add Player Popup */}
            {isAddPlayerOpen && (
                <div className="popupOverlay">
                    <div className="popupContent">
                        <h3>Add New Player</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        />
                        <select
                            value={newPlayer.position}
                            onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                        >
                            <option value="">Select Position</option>
                            <option value="defender">Defender</option>
                            <option value="midfielder">Midfielder</option>
                            <option value="forward">Forward</option>
                        </select>

                        {/* Add Skills Section */}
                        <h4>Skills</h4>
                        {newPlayer.skills.map((skill, index) => (
                            <div key={index} className="skillEntry">
                                {skill.name}: {skill.level}
                            </div>
                        ))}
                        <SkillInputPopup onAddSkill={addSkill} />

                        <button onClick={handleAddPlayer} className="buttonSmall">Add Player</button>
                        <button onClick={toggleAddPlayerPopup} className="buttonSmall">Cancel</button>
                    </div>
                </div>
            )}

            <ul>
                {filteredPlayers.map((player) => (
                    <li
                        key={player.id}
                        className="playerRow"
                        onMouseMove={handleMouseMove}
                    >
                        <div className="playerName">
                            <strong>{player.name}</strong> - {player.position}
                        </div>
                        <div className="playerButtons">
                            <button onClick={() => onAddToTeam(player)} className="buttonSmall">{'>>'}</button>
                            <button onClick={() => onDeletePlayer(player.id)} className="buttonSmall" style={{ color: 'red' }}>X</button>
                        </div>

                        {/* Tooltip content */}
                        <div
                            className="tooltip"
                            style={{ top: tooltipPosition.top - 20, left: tooltipPosition.left + 10 }}
                        >
                            <strong>Skills:</strong>
                            <ul>
                                {player.skills.map((skill) => (
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

// Separate component for skill input
const SkillInputPopup = ({ onAddSkill }) => {
    const [skillName, setSkillName] = useState('');
    const [skillLevel, setSkillLevel] = useState('');

    const handleAddSkill = () => {
        onAddSkill(skillName, parseInt(skillLevel, 10));
        setSkillName('');
        setSkillLevel('');
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Skill Name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Skill Level"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
            />
            <button onClick={handleAddSkill} className="buttonSmall">Add Skill</button>
        </div>
    );
};

// Define prop types
PlayerList.propTypes = {
    players: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            skills: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    level: PropTypes.number.isRequired
                })
            )
        })
    ).isRequired,
    onAddToTeam: PropTypes.func.isRequired,
    onDeletePlayer: PropTypes.func.isRequired,
    onAddPlayer: PropTypes.func.isRequired,
    onGenerateRandomPlayers: PropTypes.func.isRequired,
};

export default PlayerList;
