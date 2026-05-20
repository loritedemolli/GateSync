using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.User
{
    public class UpdateUserDTO
    {
        [Required(ErrorMessage = "Username është i detyrueshëm")]
        [StringLength(50, MinimumLength = 3,
            ErrorMessage = "Username duhet të jetë 3-50 karaktere")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Roli është i detyrueshëm")]
        public int RoleId { get; set; }
    }
}