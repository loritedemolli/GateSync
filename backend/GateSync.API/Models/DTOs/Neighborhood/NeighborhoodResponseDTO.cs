namespace GateSync.API.Models.DTOs.Neighborhood
{
    public class NeighborhoodResponseDTO
    {
        public int NeighborhoodId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public string CityName { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
        public int TotalResidences { get; set; }
    }
}