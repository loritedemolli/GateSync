using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Neighborhood
{
    public class UpdateNeighborhoodDTO
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Address { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; }

        [Required]
        public int CityId { get; set; }
    }
}