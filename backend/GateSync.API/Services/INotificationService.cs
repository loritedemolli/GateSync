using GateSync.API.Models.DTOs.Notification;

namespace GateSync.API.Services
{
    public interface INotificationService
    {
        Task<List<NotificationResponseDTO>> GetAllAsync();
        Task<NotificationResponseDTO?> GetByIdAsync(int id);
        Task<List<NotificationResponseDTO>> GetByResidentIdAsync(int residentId);
        Task<NotificationResponseDTO> CreateAsync(CreateNotificationDTO dto);
        Task<NotificationResponseDTO?> UpdateAsync(int id, UpdateNotificationDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<List<NotificationResponseDTO>> GetByUserIdAsync(int userId);
    }
}