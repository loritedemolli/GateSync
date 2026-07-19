using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface INeighborhoodRepository
    {
        Task<List<Neighborhood>> GetAllAsync();
        Task<Neighborhood?> GetByIdAsync(int id);
        Task<List<Neighborhood>> GetByCityIdAsync(int cityId);
        Task CreateAsync(Neighborhood neighborhood);
        Task UpdateAsync(Neighborhood neighborhood);
        Task DeleteAsync(Neighborhood neighborhood);
        Task<bool> ExistsAsync(int id);
    }
}