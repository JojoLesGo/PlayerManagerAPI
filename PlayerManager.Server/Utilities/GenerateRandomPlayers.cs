using PlayerManager.Server.Enums;
using PlayerManager.Server.Models;
using PlayerManager.Server.Repositories;

namespace PlayerManager.Server.Utilities
{
    public static class GenerateRandomPlayers
    {
        public static void GeneratePlayers(int count, IPlayerRepository repository)
        {
            var random = new Random();
            var positions = Enum.GetValues(typeof(Position)).Cast<Position>().ToList();
            var skills = Enum.GetValues(typeof(SkillName)).Cast<SkillName>().ToList();

            for (int i = 0; i < count; i++)
            {
                var player = new Player
                {
                    Id = Guid.NewGuid(), // Ensure each player has a unique ID
                    Name = $"Random Player {i + 1}",
                    Position = positions[random.Next(positions.Count)], // Random position
                    Skills = skills.Select(skill => new Skill
                    {
                        Name = skill,
                        Level = random.Next(1, 101) // Random level between 1 and 100
                    }).ToList()
                };

                // Add each player to the repository
                repository.AddPlayer(player);
            }
        }
    }
}
