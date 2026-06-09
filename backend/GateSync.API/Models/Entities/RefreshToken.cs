namespace GateSync.API.Models.Entities
{
    public class RefreshToken
    {
        public int RefreshTokenId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int UserId { get; set; }

        // Navigation Property
        public User User { get; set; } = null!;
    }
}