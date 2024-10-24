import { useState, useEffect } from 'react';
import PlayerList from './components/PlayerList.jsx';

function App() {
    const [players, setPlayers] = useState([]);
    const [team, setTeam] = useState([]); // Players in the team
    const [bestPlayers, setBestPlayers] = useState([]); // Best players returned from the API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState(
        Array(5).fill({ position: '', skill: '' }) // Initialize with 5 selectors
    );

    const positions = ['defender', 'midfielder', 'forward'];
    const skills = ['defense', 'attack', 'speed', 'strength', 'stamina'];

    // Fetch players from API when the component mounts
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('/api/players');
                const text = await response.text(); // Log the raw response
                console.log('Raw response:', text);

                if (!response.ok) {
                    throw new Error('Failed to fetch players');
                }

                const data = JSON.parse(text); // Manually parse JSON after logging
                console.log('Players data:', data);
                setPlayers(data);
            } catch (error) {
                console.error('Error fetching players:', error); // Log error
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    // Handle change in dropdown selectors
    const handleSelectChange = (index, field, value) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = { ...newSelectedOptions[index], [field]: value };
        setSelectedOptions(newSelectedOptions);
    };

    // Assemble Best Team from server
    const assembleBestTeam = async () => {
        try {
            const existingPlayerNames = team.map(player => player.name).join(','); // Get names of players already in the team

            const requests = selectedOptions.map(async ({ position, skill }) => {
                if (position && skill) {
                    const response = await fetch(`/api/select?positionStr=${position}&skillStr=${skill}&existingPlayers=${existingPlayerNames}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        const bestPlayer = await response.json();
                        return bestPlayer;
                    } else {
                        console.error(`Failed to fetch best player for ${position} with ${skill}`);
                        return null;
                    }
                }
                return null;
            });

            const bestTeam = await Promise.all(requests); // Wait for all requests to complete
            setBestPlayers(bestTeam.filter(player => player)); // Update best players for right column
        } catch (error) {
            console.error('Error assembling best team:', error);
            setError('Failed to assemble the best team.');
        }
    };

    // Fetch random players from the new API endpoint
    const generateRandomPlayers = async () => {
        try {
            // First, call the API to generate and store random players
            const response = await fetch('/api/getrandomplayerlist', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to generate random players');
            }

            // Now, fetch the updated player list
            const playersResponse = await fetch('/api/players');
            if (!playersResponse.ok) {
                throw new Error('Failed to fetch updated players');
            }
            const playersData = await playersResponse.json();
            setPlayers(playersData); // Update the player list with the fetched players
            setTeam([]); // Clear the team when new players are generated
        } catch (error) {
            console.error('Error generating or fetching players:', error);
            setError('Failed to generate or fetch players.');
        }
    };

    if (loading) {
        return <p>Loading players...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div style={styles.container}>
            {/* Add buttons at the top */}
            <div style={styles.buttonContainer}>
                <button onClick={generateRandomPlayers} style={styles.button}>
                    Generate Random Players
                </button>
                <button style={{ ...styles.button, marginLeft: '10px' }} onClick={assembleBestTeam}>
                    Assemble Best Team
                </button>
            </div>

            {/* Layout for PlayerList, Position/Skill Selectors, and Best Team */}
            <div style={styles.columnsContainer}>
                {/* Left side: PlayerList for available players */}
                <div style={styles.column}>
                    <h3>Available Players</h3>
                    <PlayerList players={players} />
                </div>

                {/* Middle: Dropdown selectors for Position and Skill */}
                <div style={styles.column}>
                    <h3>Select Position and Skill for Best Team:</h3>
                    {selectedOptions.map((option, index) => (
                        <div key={index} style={styles.selector}>
                            <select
                                value={option.position}
                                onChange={(e) => handleSelectChange(index, 'position', e.target.value)}
                                style={styles.select}
                            >
                                <option value="">Select Position</option>
                                {positions.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                            <select
                                value={option.skill}
                                onChange={(e) => handleSelectChange(index, 'skill', e.target.value)}
                                style={{ ...styles.select, marginLeft: '10px' }}
                            >
                                <option value="">Select Skill</option>
                                {skills.map(skill => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Right side: PlayerList for Best Players */}
                <div style={styles.column}>
                    <h3>Best Players</h3>
                    <PlayerList players={bestPlayers} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: '#1a1a1a', // Dark background
        color: '#f0f0f0', // Light text
    },
    buttonContainer: {
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
    },
    columnsContainer: {
        display: 'flex',
        justifyContent: 'center', // Center the columns horizontally
        width: '100%', // Use the full width
    },
    column: {
        flex: 1,
        margin: '0 10px',
        backgroundColor: '#2c2c2c',
        padding: '20px',
        borderRadius: '8px',
    },
    selectorContainer: {
        display: 'flex', // Display the dropdowns side-by-side
        justifyContent: 'space-between', // Add space between the dropdowns
        marginBottom: '10px',
    },
    select: {
        width: '48%', // Each dropdown takes up 48% of the width, allowing them to sit side-by-side
        padding: '5px',
    }
};


export default App;
