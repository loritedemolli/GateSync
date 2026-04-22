namespace GateSync.API.Models.Entities
{
    public class Country
    {
        public int CountryId { get; set; }
        public string Name { get; set; } = string.Empty;

        // Një Country ka shumë Cities
        public ICollection<City> Cities { get; set; } 
            = new List<City>();
    }
}