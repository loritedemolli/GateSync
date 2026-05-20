namespace GateSync.API.Models.DTOs.Report
{
    public class ReportResponseDTO
    {
        public int ReportId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ReportType { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public string GeneratedByUsername { get; set; } = string.Empty;
    }
}