using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Invoice
{
    public class InvoiceResponseDTO
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public DateOnly DueDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ResidenceAddress { get; set; } = string.Empty;
    }
}