namespace GateSync.API.Models.Entities
{
    public class Invoice
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public DateOnly DueDate { get; set; }

        // Enum 
        public InvoiceStatus Status { get; set; } 
            = InvoiceStatus.Pending;
        public int ResidenceId { get; set; }
        public Residence Residence { get; set; } = null!;
        public ICollection<Payment> Payments { get; set; } 
            = new List<Payment>();
    }
}