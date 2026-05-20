using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IPaymentRepository
    {
        Task<List<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task<List<Payment>> GetByResidentIdAsync(int residentId);
        Task CreateAsync(Payment payment);
        Task UpdateAsync(Payment payment);
        Task DeleteAsync(Payment payment);
        Task<bool> ExistsAsync(int id);
    }
}