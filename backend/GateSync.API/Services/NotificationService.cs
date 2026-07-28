using GateSync.API.Models.DTOs.Notification;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repository;

        public NotificationService(INotificationRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<NotificationResponseDTO>> GetAllAsync()
        {
            var notifications = await _repository.GetAllAsync();
            return notifications.Select(n => new NotificationResponseDTO
            {
                NotificationId = n.NotificationId,
                Title = n.Title,
                Message = n.Message,
                SentAt = n.SentAt,
                IsRead = n.IsRead,
                ResidentName = n.Resident.FullName
            }).ToList();
        }

        public async Task<NotificationResponseDTO?> GetByIdAsync(int id)
        {
            var notification = await _repository.GetByIdAsync(id);
            if (notification == null) return null;

            return new NotificationResponseDTO
            {
                NotificationId = notification.NotificationId,
                Title = notification.Title,
                Message = notification.Message,
                SentAt = notification.SentAt,
                IsRead = notification.IsRead,
                ResidentName = notification.Resident.FullName
            };
        }

        public async Task<List<NotificationResponseDTO>> GetByResidentIdAsync(int residentId)
        {
            var notifications = await _repository.GetByResidentIdAsync(residentId);
            return notifications.Select(n => new NotificationResponseDTO
            {
                NotificationId = n.NotificationId,
                Title = n.Title,
                Message = n.Message,
                SentAt = n.SentAt,
                IsRead = n.IsRead,
                ResidentName = n.Resident.FullName
            }).ToList();
        }

        public async Task<NotificationResponseDTO> CreateAsync(CreateNotificationDTO dto)
        {
            var notification = new Notification
            {
                Title = dto.Title,
                Message = dto.Message,
                SentAt = DateTime.UtcNow,
                IsRead = false,
                ResidentId = dto.ResidentId
            };

            await _repository.CreateAsync(notification);
            var created = await _repository.GetByIdAsync(notification.NotificationId);

            return new NotificationResponseDTO
            {
                NotificationId = created!.NotificationId,
                Title = created.Title,
                Message = created.Message,
                SentAt = created.SentAt,
                IsRead = created.IsRead,
                ResidentName = created.Resident.FullName
            };
        }

        public async Task<NotificationResponseDTO?> UpdateAsync(int id, UpdateNotificationDTO dto)
        {
            var notification = await _repository.GetByIdAsync(id);
            if (notification == null) return null;

            notification.IsRead = dto.IsRead;
            await _repository.UpdateAsync(notification);

            var updated = await _repository.GetByIdAsync(id);
            return new NotificationResponseDTO
            {
                NotificationId = updated!.NotificationId,
                Title = updated.Title,
                Message = updated.Message,
                SentAt = updated.SentAt,
                IsRead = updated.IsRead,
                ResidentName = updated.Resident.FullName
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var notification = await _repository.GetByIdAsync(id);
            if (notification == null) return false;

            await _repository.DeleteAsync(notification);
            return true;
        }
        public async Task<List<NotificationResponseDTO>> GetByUserIdAsync(int userId)
        {
            var notifications = await _repository.GetAllAsync();
            return notifications
                .Where(n => n.Resident.UserId == userId)
                .Select(n => new NotificationResponseDTO
                {
                    NotificationId = n.NotificationId,
                    Title = n.Title,
                    Message = n.Message,
                    SentAt = n.SentAt,
                    ResidentName = n.Resident?.FullName ?? "All Residents"
                }).ToList();
        }
    }
}