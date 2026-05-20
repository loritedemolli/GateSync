using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
	public class CityRepository : ICityRepository
	{
		private readonly AppDbContext _context;

		public CityRepository(AppDbContext context)
		{
			_context = context;
		}

		public async Task<List<City>> GetAllAsync()
		{
			return await _context.Cities
				.Include(c => c.Country) // ngarkon Country për emrin
				.OrderBy(c => c.Name)
				.ToListAsync();
		}

		public async Task<City?> GetByIdAsync(int id)
		{
			return await _context.Cities
				.Include(c => c.Country)
				.FirstOrDefaultAsync(c => c.CityId == id);
		}

		public async Task CreateAsync(City city)
		{
			await _context.Cities.AddAsync(city);
			await _context.SaveChangesAsync();
		}

		public async Task UpdateAsync(City city)
		{
			_context.Cities.Update(city);
			await _context.SaveChangesAsync();
		}

		public async Task DeleteAsync(City city)
		{
			_context.Cities.Remove(city);
			await _context.SaveChangesAsync();
		}

		public async Task<bool> ExistsAsync(int id)
		{
			return await _context.Cities
				.AnyAsync(c => c.CityId == id);
		}
	}
}