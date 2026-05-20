using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Payment
{
    public class PaymentResponseDTO
    {
        public int PaymentId { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Method { get; set; } = string.Empty;
        public string ResidentName { get; set; } = string.Empty;
        public decimal InvoiceAmount { get; set; }
    }
}