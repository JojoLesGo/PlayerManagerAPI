using PlayerManager.Server.Enums;

namespace PlayerManager.Server.Models
{
    public class Skill
    {
        public SkillName Name { get; set; } // Now using the SkillName enum
        public int Level { get; set; }
    }
}
