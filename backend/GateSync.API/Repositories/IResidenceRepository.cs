using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IResidenceRepository
    {
        Task<List<Residence>> GetAllAsync();
        Task<Residence?> GetByIdAsync(int id);
        Task CreateAsync(Residence residence);
        Task UpdateAsync(Residence residence);
        Task DeleteAsync(Residence residence);
        Task<bool> ExistsAsync(int id);
    }
}