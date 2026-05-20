using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class ResidentRepository : IResidentRepository
    {
        private readonly AppDbContext _context;

        public ResidentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Resident>> GetAllAsync()
        {
            return await _context.Residents
                .Include(r => r.Residence)
                .Include(r => r.User)
                .OrderBy(r => r.FullName)
                .ToListAsync();
        }

        public async Task<Resident?> GetByIdAsync(int id)
        {
            return await _context.Residents
                .Include(r => r.Residence)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ResidentId == id);
        }

        public async Task<Resident?> GetByUserIdAsync(int userId)
        {
            return await _context.Residents
                .Include(r => r.Residence)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userId);
        }

        public async Task CreateAsync(Resident resident)
        {
            await _context.Residents.AddAsync(resident);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Resident resident)
        {
            _context.Residents.Update(resident);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Resident resident)
        {
            _context.Residents.Remove(resident);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Residents
                .AnyAsync(r => r.ResidentId == id);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Residents
                .AnyAsync(r => r.Email == email);
        }
    }
}