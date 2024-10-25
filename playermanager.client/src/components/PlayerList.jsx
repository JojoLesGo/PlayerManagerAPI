import PropTypes from 'prop-types';
import './PlayerList.css';
import { useState, useEffect } from 'react';

const PlayerList = ({ players, onAddToTeam, onDeletePlayer, onAddPlayer, onGenerateRandomPlayers }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState({ name: '', position: '', skills: [] });
    const [positions, setPositions] = useState([]);
    const [skills, setSkills] = useState([]);
    const [skillName, setSkillName] = useState('');
    const [skillLevel, setSkillLevel] = useState('');

    const handleAddSkill = () => {
        onAddSkill(skillName, parseInt(skillLevel, 10));
        setSkillName('');
        setSkillLevel('');
    };

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
    const onAddSkill = (skillName, skillLevel) => {
        setNewPlayer((prevPlayer) => ({
            ...prevPlayer,
            skills: [...prevPlayer.skills, { name: skillName, level: parseInt(skillLevel, 10) }]
        }));
        setSkillName('');
        setSkillLevel('');
    };

    const handleAddPlayer = () => {
        onAddPlayer(newPlayer);
        toggleAddPlayerPopup(); // Close the popup after adding
    };

    const filteredPlayers = players.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (isAddPlayerOpen) {
            // Fetch positions
            const fetchPositions = async () => {
                try {
                    const response = await fetch('/api/positions');
                    if (response.ok) {
                        const data = await response.json();
                        setPositions(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch positions:', error);
                }
            };

            // Fetch skills
            const fetchSkills = async () => {
                try {
                    const response = await fetch('/api/skills');
                    if (response.ok) {
                        const data = await response.json();
                        setSkills(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch skills:', error);
                }
            };

            fetchPositions();
            fetchSkills();
        }
    }, [isAddPlayerOpen]);

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

                        {/* Positions Dropdown */}
                        <select
                            value={newPlayer.position}
                            onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                        >
                            <option value="">Select Position</option>
                            {positions.map((position) => (
                                <option key={position} value={position}>{position}</option>
                            ))}
                        </select>

                        <h4>Skills</h4>
                        {newPlayer.skills.map((skill, index) => (
                            <div key={index} className="skillEntry">
                                {skill.name}: {skill.level}
                            </div>
                        ))}

                        {/* Skill Selection */}
                        <div>
                            <select value={skillName} onChange={(e) => setSkillName(e.target.value)}>
                                <option value="">Select Skill</option>
                                {skills.map((skill) => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Skill Level"
                                value={skillLevel}
                                onChange={(e) => setSkillLevel(e.target.value)}
                            />
                            <button onClick={handleAddSkill} className="buttonSmall">Add Skill</button>
                        </div>

                        <button onClick={handleAddPlayer} className="buttonSmall">Add Player</button>
                        <button onClick={toggleAddPlayerPopup} className="buttonSmall">Cancel</button>
                    </div>
                </div>
            )}

            <ul>
                {filteredPlayers.map((player) => (
                    <li key={player.id} className="playerRow" onMouseMove={handleMouseMove}>
                        <div className="playerName">
                            <strong>{player.name}</strong> - {player.position}
                        </div>
                        <div className="playerButtons">
                            <button onClick={() => onAddToTeam(player)} className="buttonSmall">{'>>'}</button>
                            <button onClick={() => onDeletePlayer(player.id)} className="buttonSmall" style={{ color: 'red' }}>X</button>
                        </div>

                        {/* Tooltip content */}
                        <div className="tooltip" style={{ top: tooltipPosition.top - 20, left: tooltipPosition.left + 10 }}>
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
