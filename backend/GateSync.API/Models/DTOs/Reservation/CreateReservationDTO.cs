using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Reservation
{
    public class CreateReservationDTO
    {
        [Required(ErrorMessage = "Emri i objektit është i detyrueshëm")]
        public string FacilityName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Koha është e detyrueshme")]
        public DateTime Time { get; set; }

        [Required(ErrorMessage = "Banori është i detyrueshëm")]
        public int ResidentId { get; set; }
    }
}