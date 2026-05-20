using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
	public interface ICityRepository
	{
		Task<List<City>> GetAllAsync();
		Task<City?> GetByIdAsync(int id);
		Task CreateAsync(City city);
		Task UpdateAsync(City city);
		Task DeleteAsync(City city);
		Task<bool> ExistsAsync(int id);
	}
}