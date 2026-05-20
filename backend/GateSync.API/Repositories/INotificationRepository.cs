using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetAllAsync();
        Task<Notification?> GetByIdAsync(int id);
        Task<List<Notification>> GetByResidentIdAsync(int residentId);
        Task CreateAsync(Notification notification);
        Task UpdateAsync(Notification notification);
        Task DeleteAsync(Notification notification);
        Task<bool> ExistsAsync(int id);
    }
}