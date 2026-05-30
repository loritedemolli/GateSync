using GateSync.API.Models.DTOs.Country;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
	public class CountryService : ICountryService
	{
		private readonly ICountryRepository _repository;

		public CountryService(ICountryRepository repository)
		{
			_repository = repository;
		}

		public async Task<List<CountryResponseDTO>> GetAllAsync()
		{
			var countries = await _repository.GetAllAsync();
			return countries.Select(c => new CountryResponseDTO
			{
				CountryId = c.CountryId,
				Name = c.Name
			}).ToList();
		}

		public async Task<CountryResponseDTO?> GetByIdAsync(int id)
		{
			var country = await _repository.GetByIdAsync(id);
			if (country == null) return null;

			return new CountryResponseDTO
			{
				CountryId = country.CountryId,
				Name = country.Name
			};
		}

		public async Task<CountryResponseDTO> CreateAsync(CreateCountryDTO dto)
		{
			var country = new Country
			{
				Name = dto.Name
			};

			await _repository.CreateAsync(country);

			return new CountryResponseDTO
			{
				CountryId = country.CountryId,
				Name = country.Name
			};
		}

		public async Task<CountryResponseDTO?> UpdateAsync(int id, UpdateCountryDTO dto)
		{
			var country = await _repository.GetByIdAsync(id);
			if (country == null) return null;

			country.Name = dto.Name;
			await _repository.UpdateAsync(country);

			return new CountryResponseDTO
			{
				CountryId = country.CountryId,
				Name = country.Name
			};
		}

		public async Task<bool> DeleteAsync(int id)
		{
			var country = await _repository.GetByIdAsync(id);
			if (country == null) return false;

			await _repository.DeleteAsync(country);
			return true;
		}
	}
}