namespace GateSync.API.Models.DTOs.Resident
{
    public class ResidentResponseDTO
    {
        public int ResidentId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsOwner { get; set; }
        public string ResidenceAddress { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }
}