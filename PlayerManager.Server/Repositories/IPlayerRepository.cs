using PlayerManager.Server.Models;

namespace PlayerManager.Server.Repositories
{
    public interface IPlayerRepository
    {
        void AddPlayer(Player player);
        void UpdatePlayer(Player player);
        IEnumerable<Player> GetAllPlayers();
        Player? GetPlayerById(Guid id);
        Player? GetPlayerByName(string name); // New method to get player by name
        void DeletePlayer(Guid id);
    }
}
