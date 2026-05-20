namespace GateSync.API.Models.DTOs.Notification
{
    public class NotificationResponseDTO
    {
        public int NotificationId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
        public string ResidentName { get; set; } = string.Empty;
    }
}