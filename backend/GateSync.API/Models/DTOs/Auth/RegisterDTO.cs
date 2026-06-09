using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Auth
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Username është i detyrueshëm")]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm")]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Roli është i detyrueshëm")]
        public int RoleId { get; set; }
    }
}