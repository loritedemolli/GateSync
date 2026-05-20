using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Country
{
    public class CreateCountryDTO
    {
        [Required(ErrorMessage = "Emri është i detyrueshëm")]
        [StringLength(100, MinimumLength = 2, 
            ErrorMessage = "Emri duhet të jetë 2-100 karaktere")]
        public string Name { get; set; } = string.Empty;
    }
}