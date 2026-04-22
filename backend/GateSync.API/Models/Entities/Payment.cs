namespace GateSync.API.Models.Entities
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        // Enum 
        public PaymentMethod Method { get; set; }
        public int InvoiceId { get; set; }
        public int ResidentId { get; set; }

        // Navigation Properties
        public Invoice Invoice { get; set; } = null!;
        public Resident Resident { get; set; } = null!;
    }
}