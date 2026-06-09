using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Auth
{
    public class RefreshRequestDTO
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}