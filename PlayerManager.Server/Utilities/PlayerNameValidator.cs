using System.Text.RegularExpressions;

namespace PlayerManager.Server.Utilities
{

    public static class PlayerNameValidator
    {
        // List of inappropriate words/phrases
        private static readonly List<string> BannedWords = new List<string> { "badword1", "badword2", "offensivephrase" };

        // Regular expression for valid characters (alphanumeric + optional specific characters like hyphen or apostrophe)
        private static readonly Regex ValidNameRegex = new Regex("^[a-zA-Z0-9'-]+$", RegexOptions.Compiled);

        public static bool IsValidPlayerName(string name, out string? errorMessage)
        {
            // Check for null, empty, or whitespace
            if (string.IsNullOrWhiteSpace(name))
            {
                errorMessage = "Player name cannot be empty or whitespace.";
                return false;
            }

            // Check if the name contains only allowed characters
            if (!ValidNameRegex.IsMatch(name))
            {
                errorMessage = "Player name contains invalid characters. Only letters, numbers, hyphens, and apostrophes are allowed.";
                return false;
            }

            // Check for banned words/phrases
            foreach (var bannedWord in BannedWords)
            {
                if (name.IndexOf(bannedWord, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    errorMessage = $"Player name contains inappropriate content: '{bannedWord}'.";
                    return false;
                }
            }

            // If all checks pass
            errorMessage = null;
            return true;
        }
    }
}
