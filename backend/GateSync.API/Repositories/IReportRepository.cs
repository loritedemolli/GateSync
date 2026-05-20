using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IReportRepository
    {
        Task<List<Report>> GetAllAsync();
        Task<Report?> GetByIdAsync(int id);
        Task CreateAsync(Report report);
        Task UpdateAsync(Report report);
        Task DeleteAsync(Report report);
        Task<bool> ExistsAsync(int id);
    }
}