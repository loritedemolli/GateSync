using System.ComponentModel.DataAnnotations;
using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Reservation
{
    public class UpdateReservationDTO
    {
        [Required(ErrorMessage = "Emri i objektit është i detyrueshëm")]
        public string FacilityName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Koha është e detyrueshme")]
        public DateTime Time { get; set; }

        [Required(ErrorMessage = "Statusi është i detyrueshëm")]
        public ReservationStatus Status { get; set; }
    }
}