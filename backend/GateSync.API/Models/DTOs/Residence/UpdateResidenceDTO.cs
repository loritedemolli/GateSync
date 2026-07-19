using System.ComponentModel.DataAnnotations;
using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Residence
{
    public class UpdateResidenceDTO
    {
        [Required(ErrorMessage = "Adresa është e detyrueshme")]
        [StringLength(200, MinimumLength = 5,
            ErrorMessage = "Adresa duhet të jetë 5-200 karaktere")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tipi është i detyrueshëm")]
        public ResidenceType Type { get; set; }

        public bool IsOccupied { get; set; }

        [Required(ErrorMessage = "Qyteti është i detyrueshëm")]
        public int NeighborhoodId { get; set; }
    }
}