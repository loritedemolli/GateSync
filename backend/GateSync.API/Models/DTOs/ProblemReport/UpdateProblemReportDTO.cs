using System.ComponentModel.DataAnnotations;
using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.ProblemReport
{
    public class UpdateProblemReportDTO
    {
        [Required(ErrorMessage = "Titulli është i detyrueshëm")]
        [StringLength(100, MinimumLength = 3,
            ErrorMessage = "Titulli duhet të jetë 3-100 karaktere")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Përshkrimi është i detyrueshëm")]
        [StringLength(500, MinimumLength = 10,
            ErrorMessage = "Përshkrimi duhet të jetë 10-500 karaktere")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Statusi është i detyrueshëm")]
        public ProblemReportStatus Status { get; set; }
    }
}