namespace GateSync.API.Models.Entities
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public string FacilityName { get; set; } = string.Empty;
        // "Gym", "EventHall", "Pool" etj.
        public DateTime Time { get; set; }

        // Enum
        public ReservationStatus Status { get; set; } 
            = ReservationStatus.Pending;
        public int ResidentId { get; set; }
        public Resident Resident { get; set; } = null!;
    }
}