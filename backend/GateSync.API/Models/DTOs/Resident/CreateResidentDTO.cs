using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Resident
{
    public class CreateResidentDTO
    {
        [Required(ErrorMessage = "Emri i plotë është i detyrueshëm")]
        [StringLength(100, MinimumLength = 3,
            ErrorMessage = "Emri duhet të jetë 3-100 karaktere")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Numri i telefonit është i detyrueshëm")]
        [Phone(ErrorMessage = "Numri i telefonit nuk është valid")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email është i detyrueshëm")]
        [EmailAddress(ErrorMessage = "Email nuk është valid")]
        public string Email { get; set; } = string.Empty;

        public bool IsOwner { get; set; }

        [Required(ErrorMessage = "Rezidenca është e detyrueshme")]
        public int ResidenceId { get; set; }

        [Required(ErrorMessage = "User është i detyrueshëm")]
        public int UserId { get; set; }
    }
}