namespace GateSync.API.Models.Entities
{
	public class Residence
	{
		public int ResidenceId { get; set; }
		public string Address { get; set; } = string.Empty;

		// Enum 
		public ResidenceType Type { get; set; }
		public bool IsOccupied { get; set; }
		public int CityId { get; set; }
		public City City { get; set; } = null!;
		public ICollection<Resident> Residents { get; set; }
			= new List<Resident>();
		public ICollection<Invoice> Invoices { get; set; }
			= new List<Invoice>();
	}
}