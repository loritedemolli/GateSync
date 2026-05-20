using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Notification
{
    public class CreateNotificationDTO
    {
        [Required(ErrorMessage = "Titulli është i detyrueshëm")]
        [StringLength(100, MinimumLength = 3,
            ErrorMessage = "Titulli duhet të jetë 3-100 karaktere")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mesazhi është i detyrueshëm")]
        [StringLength(500, MinimumLength = 5,
            ErrorMessage = "Mesazhi duhet të jetë 5-500 karaktere")]
        public string Message { get; set; } = string.Empty;

        [Required(ErrorMessage = "Banori është i detyrueshëm")]
        public int ResidentId { get; set; }
    }
}