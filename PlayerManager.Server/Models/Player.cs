using PlayerManager.Server.Enums;

namespace PlayerManager.Server.Models
{
    public class Player
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public Position Position { get; set; } // Now using the Position enum
        public List<Skill> Skills { get; set; } = new List<Skill>();
    }
}
