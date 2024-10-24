namespace PlayerManager.Server.Utilities
{
    public static class GuidHelper
    {
        public static bool IsValidGuid(string input)
        {
            return Guid.TryParse(input, out _);
        }
    }
}
