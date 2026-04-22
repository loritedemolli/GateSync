namespace GateSync.API.Models.Entities
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public int ResidentId { get; set; }
        public Resident Resident { get; set; } = null!;
    }
}