using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IInvoiceRepository
    {
        Task<List<Invoice>> GetAllAsync();
        Task<Invoice?> GetByIdAsync(int id);
        Task<List<Invoice>> GetByResidenceIdAsync(int residenceId);
        Task CreateAsync(Invoice invoice);
        Task UpdateAsync(Invoice invoice);
        Task DeleteAsync(Invoice invoice);
        Task<bool> ExistsAsync(int id);
    }
}