using GateSync.API.Models.DTOs.Invoice;

namespace GateSync.API.Services
{
    public interface IInvoiceService
    {
        Task<List<InvoiceResponseDTO>> GetAllAsync();
        Task<InvoiceResponseDTO?> GetByIdAsync(int id);
        Task<List<InvoiceResponseDTO>> GetByResidenceIdAsync(int residenceId);
        Task<InvoiceResponseDTO> CreateAsync(CreateInvoiceDTO dto);
        Task<InvoiceResponseDTO?> UpdateAsync(int id, UpdateInvoiceDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<List<InvoiceResponseDTO>> GetByUserIdAsync(int userId);
    }
}