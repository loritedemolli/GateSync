using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class ResidenceRepository : IResidenceRepository
    {
        private readonly AppDbContext _context;

        public ResidenceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Residence>> GetAllAsync()
        {
            return await _context.Residences
                .Include(r => r.Neighborhood)
                    .ThenInclude(n => n.City)
                        .ThenInclude(c => c.Country)
                .OrderBy(r => r.Address)
                .ToListAsync();
        }

        public async Task<Residence?> GetByIdAsync(int id)
        {
            return await _context.Residences
                .Include(r => r.Neighborhood)
                    .ThenInclude(n => n.City)
                        .ThenInclude(c => c.Country)
                .FirstOrDefaultAsync(r => r.ResidenceId == id);
        }

        public async Task CreateAsync(Residence residence)
        {
            await _context.Residences.AddAsync(residence);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Residence residence)
        {
            _context.Residences.Update(residence);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Residence residence)
        {
            _context.Residences.Remove(residence);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Residences
                .AnyAsync(r => r.ResidenceId == id);
        }
    }
}