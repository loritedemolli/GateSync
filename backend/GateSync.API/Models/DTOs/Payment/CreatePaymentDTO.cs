using System.ComponentModel.DataAnnotations;
using GateSync.API.Models;

namespace GateSync.API.Models.DTOs.Payment
{
    public class CreatePaymentDTO
    {
        [Required(ErrorMessage = "Shuma e paguar është e detyrueshme")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Shuma duhet të jetë më e madhe se 0")]
        public decimal PaidAmount { get; set; }

        [Required(ErrorMessage = "Mënyra e pagesës është e detyrueshme")]
        public PaymentMethod Method { get; set; }

        [Required(ErrorMessage = "Fatura është e detyrueshme")]
        public int InvoiceId { get; set; }

        [Required(ErrorMessage = "Banori është i detyrueshëm")]
        public int ResidentId { get; set; }
    }
}