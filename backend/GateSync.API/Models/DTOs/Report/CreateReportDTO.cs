using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Report
{
    public class CreateReportDTO
    {
        [Required(ErrorMessage = "Titulli është i detyrueshëm")]
        [StringLength(100, MinimumLength = 3,
            ErrorMessage = "Titulli duhet të jetë 3-100 karaktere")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tipi i raportit është i detyrueshëm")]
        public string ReportType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Gjeneruesi është i detyrueshëm")]
        public int GeneratedByUserId { get; set; }
    }
}