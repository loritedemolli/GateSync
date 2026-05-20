namespace GateSync.API.Models.DTOs.Reservation
{
    public class ReservationResponseDTO
    {
        public int ReservationId { get; set; }
        public string FacilityName { get; set; } = string.Empty;
        public DateTime Time { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ResidentName { get; set; } = string.Empty;
    }
}