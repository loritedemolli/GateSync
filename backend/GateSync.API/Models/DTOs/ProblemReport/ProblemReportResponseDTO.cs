namespace GateSync.API.Models.DTOs.ProblemReport
{
    public class ProblemReportResponseDTO
    {
        public int ProblemReportId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReportedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ResidentName { get; set; } = string.Empty;
    }
}