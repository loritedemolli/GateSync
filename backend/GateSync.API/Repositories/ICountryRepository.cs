using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface ICountryRepository
    {
        Task<List<Country>> GetAllAsync();
        Task<Country?> GetByIdAsync(int id);
        Task CreateAsync(Country country);
        Task UpdateAsync(Country country);
        Task DeleteAsync(Country country);
        Task<bool> ExistsAsync(int id);
    }
}