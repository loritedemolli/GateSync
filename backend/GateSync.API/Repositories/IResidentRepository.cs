using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IResidentRepository
    {
        Task<List<Resident>> GetAllAsync();
        Task<Resident?> GetByIdAsync(int id);
        Task<Resident?> GetByUserIdAsync(int userId);
        Task CreateAsync(Resident resident);
        Task UpdateAsync(Resident resident);
        Task DeleteAsync(Resident resident);
        Task<bool> ExistsAsync(int id);
        Task<bool> EmailExistsAsync(string email);
    }
}