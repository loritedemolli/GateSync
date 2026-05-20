using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IRoleRepository
    {
        Task<List<Role>> GetAllAsync();
        Task<Role?> GetByIdAsync(int id);
        Task CreateAsync(Role role);
        Task UpdateAsync(Role role);
        Task DeleteAsync(Role role);
        Task<bool> ExistsAsync(int id);
    }
}