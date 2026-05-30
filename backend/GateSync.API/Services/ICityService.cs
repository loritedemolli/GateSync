using GateSync.API.Models.DTOs.City;

namespace GateSync.API.Services
{

	public interface ICityService {

		Task<List<CityResponseDTO>> GetAllAsync();

		Task<CityResponseDTO?> GetByIdAsync(int id);

		Task<CityResponseDTO> CreateAsync(CreateCityDTO dto);

		Task<CityResponseDTO?> UpdateAsync(int id, UpdateCityDTO dto);

		Task<bool> DeleteAsync(int id);

	}
}