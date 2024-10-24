using PlayerManager.Server.Enums;
using PlayerManager.Server.Models;
using PlayerManager.Server.Repositories;

namespace PlayerManager.Server.Services
{
    public class PlayerSelectionService : IPlayerSelectionService
    {
        private readonly IPlayerRepository _repository;

        public PlayerSelectionService(IPlayerRepository repository)
        {
            _repository = repository;
        }

        public Player? SelectBestPlayer(Position position, SkillName skillName, List<string> existingPlayerNames)
        {
            return _repository.GetAllPlayers()
                .Where(p => p.Position == position && p.Skills.Any(s => s.Name == skillName))
                .Where(p => !existingPlayerNames.Contains(p.Name)) // Filter out players already in the team
                .OrderByDescending(p => p.Skills.First(s => s.Name == skillName).Level)
                .FirstOrDefault();
        }
    }
}
