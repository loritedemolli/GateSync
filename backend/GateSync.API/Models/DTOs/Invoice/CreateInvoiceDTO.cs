using System.ComponentModel.DataAnnotations;

namespace GateSync.API.Models.DTOs.Invoice
{
    public class CreateInvoiceDTO
    {
        [Required(ErrorMessage = "Shuma është e detyrueshme")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Shuma duhet të jetë më e madhe se 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Data e skadimit është e detyrueshme")]
        public DateOnly DueDate { get; set; }

        [Required(ErrorMessage = "Rezidenca është e detyrueshme")]
        public int ResidenceId { get; set; }
    }
}