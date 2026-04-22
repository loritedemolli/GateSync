namespace GateSync.API.Models.Entities
{
    public class City
    {
        public int CityId { get; set; }
        public string Name { get; set; } = string.Empty;

        // Foreign Key
        public int CountryId { get; set; }

        // Navigation Properties
        public Country Country { get; set; } = null!;
        public ICollection<Residence> Residences { get; set; } 
            = new List<Residence>();
    }
}