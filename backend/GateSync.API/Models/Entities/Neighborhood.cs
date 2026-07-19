namespace GateSync.API.Models.Entities
{
    public class Neighborhood
    {
        public int NeighborhoodId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        public int CityId { get; set; }
        public City City { get; set; } = null!;
        public ICollection<Residence> Residences { get; set; } 
            = new List<Residence>();
    }
}