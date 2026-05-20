using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IProblemReportRepository
    {
        Task<List<ProblemReport>> GetAllAsync();
        Task<ProblemReport?> GetByIdAsync(int id);
        Task<List<ProblemReport>> GetByResidentIdAsync(int residentId);
        Task CreateAsync(ProblemReport problemReport);
        Task UpdateAsync(ProblemReport problemReport);
        Task DeleteAsync(ProblemReport problemReport);
        Task<bool> ExistsAsync(int id);
    }
}