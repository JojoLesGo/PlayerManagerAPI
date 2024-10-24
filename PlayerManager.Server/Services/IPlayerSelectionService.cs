using PlayerManager.Server.Enums;
using PlayerManager.Server.Models;

namespace PlayerManager.Server.Services
{
    public interface IPlayerSelectionService
    {
        Player? SelectBestPlayer(Position position, SkillName skill, List<string> existingPlayerNames);
    }
}
