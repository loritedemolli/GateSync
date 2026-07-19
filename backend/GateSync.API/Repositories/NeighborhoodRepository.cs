using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class NeighborhoodRepository : INeighborhoodRepository
    {
        private readonly AppDbContext _context;

        public NeighborhoodRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Neighborhood>> GetAllAsync()
        {
            return await _context.Neighborhoods
                .Include(n => n.City)
                    .ThenInclude(c => c.Country)
                .Include(n => n.Residences)
                .OrderBy(n => n.Name)
                .ToListAsync();
        }

        public async Task<Neighborhood?> GetByIdAsync(int id)
        {
            return await _context.Neighborhoods
                .Include(n => n.City)
                    .ThenInclude(c => c.Country)
                .Include(n => n.Residences)
                .FirstOrDefaultAsync(n => n.NeighborhoodId == id);
        }

        public async Task<List<Neighborhood>> GetByCityIdAsync(int cityId)
        {
            return await _context.Neighborhoods
                .Include(n => n.City)
                    .ThenInclude(c => c.Country)
                .Where(n => n.CityId == cityId)
                .OrderBy(n => n.Name)
                .ToListAsync();
        }

        public async Task CreateAsync(Neighborhood neighborhood)
        {
            await _context.Neighborhoods.AddAsync(neighborhood);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Neighborhood neighborhood)
        {
            _context.Neighborhoods.Update(neighborhood);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Neighborhood neighborhood)
        {
            _context.Neighborhoods.Remove(neighborhood);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Neighborhoods
                .AnyAsync(n => n.NeighborhoodId == id);
        }
    }
}