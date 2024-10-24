import PropTypes from 'prop-types';
import { useState } from 'react';

const PlayerList = ({ players, onAddToTeam, onDeletePlayer }) => {
    const [hoveredPlayer, setHoveredPlayer] = useState(null); // Track hovered player

    // Show skills on hover
    const handleMouseEnter = (player) => {
        setHoveredPlayer(player);
    };

    const handleMouseLeave = () => {
        setHoveredPlayer(null);
    };

    const styles = {
        playerRow: {
            display: 'flex', // Display player name and buttons in a row
            alignItems: 'center', // Vertically align the player name and buttons
            marginBottom: '10px', // Add a bit more space between rows for clarity
        },
        playerName: {
            flexGrow: 0, // Prevent the name from growing too much
            marginRight: '10px', // Add spacing between the name and buttons
        },
        playerButtons: {
            display: 'flex',
            justifyContent: 'flex-end', // Ensure buttons align to the right side
            alignItems: 'center', // Vertically align the buttons
        },
        buttonSmall: {
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer',
            marginLeft: '5px',
        },
    };

    return (
        <div>
            <h2>Available Players</h2>
            <ul>
                {players.map((player) => (
                    <li
                        key={player.id}
                        style={styles.playerRow} // Apply flex styling to each player row
                        onMouseEnter={() => handleMouseEnter(player)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div style={styles.playerName}>
                            <strong>{player.name}</strong> - {player.position}
                        </div>
                        <div style={styles.playerButtons}>
                            <button onClick={() => onAddToTeam(player)} style={styles.buttonSmall}>{'>>'}</button>
                            <button onClick={() => onDeletePlayer(player.id)} style={{ ...styles.buttonSmall, color: 'red' }}>X</button>
                        </div>

                        {/* Show the player's skills on hover */}
                        {hoveredPlayer && hoveredPlayer.id === player.id && (
                            <div style={{ marginTop: '5px', background: '#f0f0f0', color: '#333', padding: '5px', borderRadius: '5px' }}>
                                <strong>Skills:</strong>
                                <ul>
                                    {player.skills.map((skill) => (
                                        <li key={skill.name}>
                                            {skill.name}: {skill.level}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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
    onDeletePlayer: PropTypes.func.isRequired
};

export default PlayerList;
