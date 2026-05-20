using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetAllAsync()
        {
            return await _context.Notifications
                .Include(n => n.Resident)
                .OrderByDescending(n => n.SentAt)
                .ToListAsync();
        }

        public async Task<Notification?> GetByIdAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.Resident)
                .FirstOrDefaultAsync(n => n.NotificationId == id);
        }

        public async Task<List<Notification>> GetByResidentIdAsync(int residentId)
        {
            return await _context.Notifications
                .Where(n => n.ResidentId == residentId)
                .OrderByDescending(n => n.SentAt)
                .ToListAsync();
        }

        public async Task CreateAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Notification notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Notification notification)
        {
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Notifications
                .AnyAsync(n => n.NotificationId == id);
        }
    }
}