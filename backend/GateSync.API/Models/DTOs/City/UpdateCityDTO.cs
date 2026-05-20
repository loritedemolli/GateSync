using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.City
{
    public class UpdateCityDTO
    {
        [Required(ErrorMessage = "Emri është i detyrueshëm")]
        [StringLength(100, MinimumLength = 2,
            ErrorMessage = "Emri duhet të jetë 2-100 karaktere")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Shteti është i detyrueshëm")]
        public int CountryId { get; set; }
    }
}