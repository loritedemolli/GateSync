namespace GateSync.API.Models.Entities
{
    public class Resident
    {
        public int ResidentId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsOwner { get; set; }

        // FK
        public int? ResidenceId { get; set; }
        public int UserId { get; set; }

        // Navigation Properties
        public Residence? Residence { get; set; } = null!;
        public User User { get; set; } = null!;

        // Nje Resident ben shume Payments
        public ICollection<Payment> Payments { get; set; } 
            = new List<Payment>();

        // Nje Resident raporton shume Probleme
        public ICollection<ProblemReport> ProblemReports { get; set; } 
            = new List<ProblemReport>();

        // Nje Resident ben shume Reservations
        public ICollection<Reservation> Reservations { get; set; } 
            = new List<Reservation>();

        // Nje Resident ka shume Vehicles
        public ICollection<Vehicle> Vehicles { get; set; } 
            = new List<Vehicle>();

        // Nje Resident merr shume Notifications
        public ICollection<Notification> Notifications { get; set; } 
            = new List<Notification>();
    }
}