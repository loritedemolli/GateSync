using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class CountryRepository : ICountryRepository
    {
        private readonly AppDbContext _context;

        public CountryRepository(AppDbContext context) {
            _context = context;
        }

        public async Task<List<Country>> GetAllAsync() {
            return await _context.Countries
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<Country?> GetByIdAsync(int id) {
            return await _context.Countries
                .FirstOrDefaultAsync(c => c.CountryId == id);
        }

        public async Task CreateAsync(Country country) {
            await _context.Countries.AddAsync(country);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Country country) {
            _context.Countries.Update(country);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Country country) {
            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id) {
            return await _context.Countries
                .AnyAsync(c => c.CountryId == id);
        }
    }
}