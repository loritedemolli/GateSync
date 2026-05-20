namespace GateSync.API.Models.DTOs.Vehicle
{
    public class VehicleResponseDTO
    {
        public int VehicleId { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public string ResidentName { get; set; } = string.Empty;
    }
}