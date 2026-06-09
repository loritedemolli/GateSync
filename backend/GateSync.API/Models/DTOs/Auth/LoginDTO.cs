using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Auth
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Username është i detyrueshëm")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm")]
        public string Password { get; set; } = string.Empty;
    }
}