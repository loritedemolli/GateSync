using GateSync.API.Models.DTOs.City;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class CityService : ICityService
    {
        private readonly ICityRepository _repository;

        public CityService(ICityRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<CityResponseDTO>> GetAllAsync()
        {
            var cities = await _repository.GetAllAsync();
            return cities.Select(c => new CityResponseDTO
            {
                CityId = c.CityId,
                Name = c.Name,
                CountryName = c.Country.Name
            }).ToList();
        }

        public async Task<CityResponseDTO?> GetByIdAsync(int id)
        {
            var city = await _repository.GetByIdAsync(id);
            if (city == null) return null;

            return new CityResponseDTO
            {
                CityId = city.CityId,
                Name = city.Name,
                CountryName = city.Country.Name
            };
        }

        public async Task<CityResponseDTO> CreateAsync(CreateCityDTO dto)
        {
            var city = new City
            {
                Name = dto.Name,
                CountryId = dto.CountryId
            };

            await _repository.CreateAsync(city);
            var created = await _repository.GetByIdAsync(city.CityId);

            return new CityResponseDTO
            {
                CityId = created!.CityId,
                Name = created.Name,
                CountryName = created.Country.Name
            };
        }

        public async Task<CityResponseDTO?> UpdateAsync(int id, UpdateCityDTO dto)
        {
            var city = await _repository.GetByIdAsync(id);
            if (city == null) return null;

            city.Name = dto.Name;
            city.CountryId = dto.CountryId;
            await _repository.UpdateAsync(city);

            var updated = await _repository.GetByIdAsync(id);
            return new CityResponseDTO
            {
                CityId = updated!.CityId,
                Name = updated.Name,
                CountryName = updated.Country.Name
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var city = await _repository.GetByIdAsync(id);
            if (city == null) return false;

            await _repository.DeleteAsync(city);
            return true;
        }
    }
}