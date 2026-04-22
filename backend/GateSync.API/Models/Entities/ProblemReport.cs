namespace GateSync.API.Models.Entities
{
    public class ProblemReport
    {
        public int ProblemReportId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;

        // Enum
        public ProblemReportStatus Status { get; set; } 
            = ProblemReportStatus.Pending;
        public int ResidentId { get; set; }

        // Navigation Property
        public Resident Resident { get; set; } = null!;
    }
}