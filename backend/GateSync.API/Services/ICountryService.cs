using GateSync.API.Models.DTOs.Country;

namespace GateSync.API.Services
{
	public interface ICountryService
	{
		Task<List<CountryResponseDTO>> GetAllAsync();
		Task<CountryResponseDTO?> GetByIdAsync(int id);
		Task<CountryResponseDTO> CreateAsync(CreateCountryDTO dto);
		Task<CountryResponseDTO?> UpdateAsync(int id, UpdateCountryDTO dto);
		Task<bool> DeleteAsync(int id);
	}
}