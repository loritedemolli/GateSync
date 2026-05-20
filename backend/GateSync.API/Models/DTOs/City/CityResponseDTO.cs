namespace GateSync.API.Models.DTOs.City
{
    public class CityResponseDTO
    {
        public int CityId { get; set; }
        public string Name { get; set; } = string.Empty;

        public string CountryName { get; set; } = string.Empty;
    }
}