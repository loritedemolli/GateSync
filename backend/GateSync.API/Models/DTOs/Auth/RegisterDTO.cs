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

        [Required(ErrorMessage = "Emri i plotë është i detyrueshëm")]
        [StringLength(100, MinimumLength = 3)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email është i detyrueshëm")]
        [EmailAddress(ErrorMessage = "Email nuk është valid")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Numri i telefonit është i detyrueshëm")]
        [Phone(ErrorMessage = "Numri i telefonit nuk është valid")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rezidenca është e detyrueshme")]
        public int ResidenceId { get; set; }

        public bool IsOwner { get; set; }
    }
}