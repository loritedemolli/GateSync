using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.User
{
    public class CreateUserDTO
    {
        [Required(ErrorMessage = "Username është i detyrueshëm")]
        [StringLength(50, MinimumLength = 3,
            ErrorMessage = "Username duhet të jetë 3-50 karaktere")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm")]
        [StringLength(100, MinimumLength = 6,
            ErrorMessage = "Fjalëkalimi duhet të jetë minimum 6 karaktere")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Roli është i detyrueshëm")]
        public int RoleId { get; set; }
    }
}