using PlayerManager.Server.Enums;
using PlayerManager.Server.Models;
using System.Xml.Linq;

namespace PlayerManager.Server.Repositories
{
    public class InMemoryPlayerRepository : IPlayerRepository
    {
        private List<Player> _players = new List<Player>() {
            new Player() {Name = "John Doe 1", Position = Position.Forward, Skills = new List<Skill>() { new Skill() { Name = SkillName.Strength, Level = 1 } } },
            new Player() {Name = "John Doe 2", Position = Position.Forward, Skills = new List<Skill>() { new Skill() { Name = SkillName.Strength, Level = 2 } } },
            new Player() {Name = "John Doe 3", Position = Position.Forward, Skills = new List<Skill>() { new Skill() { Name = SkillName.Strength, Level = 3 } } },
            new Player() {Name = "John Doe 4", Position = Position.Forward, Skills = new List<Skill>() { new Skill() { Name = SkillName.Strength, Level = 4 } } },
            new Player() {Name = "John Doe 5", Position = Position.Forward, Skills = new List<Skill>() { new Skill() { Name = SkillName.Strength, Level = 5 } } }
        };

        public void AddPlayer(Player player) => _players.Add(player);

        public void UpdatePlayer(Player player)
        {
            var index = _players.FindIndex(p => p.Id == player.Id);
            if (index != -1) _players[index] = player;
        }

        public IEnumerable<Player> GetAllPlayers() => _players;

        public Player? GetPlayerById(Guid id) => _players.FirstOrDefault(p => p.Id == id);

        public Player? GetPlayerByName(string name) =>
            _players.FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase)); // Case-insensitive search

        public void DeletePlayer(Guid id)
        {
            var player = GetPlayerById(id);
            if (player != null) _players.Remove(player);
        }
    }
}
