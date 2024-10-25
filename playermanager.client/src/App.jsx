import { useState, useEffect } from 'react';
import PlayerList from './components/PlayerList.jsx';
import TeamList from './components/TeamList.jsx'; // Import TeamList
import './App.css';
import './global.css';

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

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('/api/players');
                if (!response.ok) {
                    throw new Error('Failed to fetch players');
                }

                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error('Error fetching players:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    const handleSelectChange = (index, field, value) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = { ...newSelectedOptions[index], [field]: value };
        setSelectedOptions(newSelectedOptions);
    };

    const addToTeam = (player) => {
        if (team.length < 5) {
            setTeam([...team, player]);
            setPlayers(players.filter((p) => p.id !== player.id));
        }
    };

    const removeFromTeam = (player) => {
        setTeam(team.filter((p) => p.id !== player.id));
        setPlayers([...players, player]);
    };

    const onDeletePlayer = async (playerId) => {
        try {
            const response = await fetch(`/api/players/${playerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete player');
            }

            setPlayers(players.filter((player) => player.id !== playerId));
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    const assembleBestTeam = async () => {
        try {
            let currentTeam = [...team]; // Start with the current team

            // Loop through selectedOptions to make each request one by one
            for (const { position, skill } of selectedOptions) {
                if (position && skill) {
                    // Update the existing player names before each request
                    const existingPlayerNames = currentTeam.map(player => player.name).join(',');

                    const response = await fetch(`/api/select?positionStr=${position}&skillStr=${skill}&existingPlayers=${existingPlayerNames}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        const bestPlayer = await response.json();

                        if (bestPlayer) {
                            currentTeam.push(bestPlayer); // Add the best player to the team
                        }
                    } else {
                        console.error(`Failed to fetch best player for ${position} with ${skill}`);
                    }
                }
            }

            setBestPlayers(currentTeam); // Set the updated team as the best players
        } catch (error) {
            console.error('Error assembling best team:', error);
            setError('Failed to assemble the best team.');
        }
    };


    const generateRandomPlayers = async () => {
        try {
            const response = await fetch('/api/getrandomplayerlist', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to generate random players');
            }

            const playersResponse = await fetch('/api/players');
            if (!playersResponse.ok) {
                throw new Error('Failed to fetch updated players');
            }

            const playersData = await playersResponse.json();
            setPlayers(playersData);
            setTeam([]);
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
        <div className="container">
            <h1>Team Manager</h1>
            <div className="columnsContainer">
                <div className="column">
                    <PlayerList players={players} onAddToTeam={addToTeam} onDeletePlayer={onDeletePlayer} onGenerateRandomPlayers={generateRandomPlayers} />
                </div>

                <div className="column">
                    <h3>Positions and Skills</h3>
                    {selectedOptions.map((option, index) => (
                        <div key={index} className="selectorContainer">
                            <select value={option.position} onChange={(e) => handleSelectChange(index, 'position', e.target.value)} className="select">
                                <option value="">Select Position</option>
                                {positions.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                            <select value={option.skill} onChange={(e) => handleSelectChange(index, 'skill', e.target.value)} className="select">
                                <option value="">Select Skill</option>
                                {skills.map(skill => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="column">
                    <TeamList teamMembers={team} removeFromTeam={removeFromTeam} assembleBestTeam={assembleBestTeam} />
                </div>
            </div>
        </div>
    );
}

export default App;
