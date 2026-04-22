namespace GateSync.API.Models.Entities
{
    public class Report
    {
        public int ReportId { get; set; }
        public string Title { get; set; } = string.Empty;

        // "Financial", "Maintenance", "Security"
        public string ReportType { get; set; } = string.Empty;
        public int GeneratedByUserId { get; set; }
        public User GeneratedBy { get; set; } = null!;
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}