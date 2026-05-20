using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Vehicle
{
    public class UpdateVehicleDTO
    {
        [Required(ErrorMessage = "Targa është e detyrueshme")]
        [StringLength(20, MinimumLength = 2,
            ErrorMessage = "Targa duhet të jetë 2-20 karaktere")]
        public string PlateNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Marka është e detyrueshme")]
        public string Brand { get; set; } = string.Empty;

        [Required(ErrorMessage = "Modeli është i detyrueshëm")]
        public string ModelName { get; set; } = string.Empty;
    }
}