using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _context;

        public RoleRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Role>> GetAllAsync()
        {
            return await _context.Roles
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<Role?> GetByIdAsync(int id)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleId == id);
        }

        public async Task CreateAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Role role)
        {
            _context.Roles.Update(role);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Role role)
        {
            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Roles
                .AnyAsync(r => r.RoleId == id);
        }
    }
}