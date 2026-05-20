using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Residence
{
    public class ResidenceResponseDTO
    {
        public int ResidenceId { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsOccupied { get; set; }
        public string CityName { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
    }
}