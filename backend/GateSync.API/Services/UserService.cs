using GateSync.API.Models.DTOs.User;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<UserResponseDTO>> GetAllAsync()
        {
            var users = await _repository.GetAllAsync();
            return users.Select(u => new UserResponseDTO
            {
                UserId = u.UserId,
                Username = u.Username,
                RoleName = u.Role.Name.ToString()
            }).ToList();
        }

        public async Task<UserResponseDTO?> GetByIdAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null) return null;

            return new UserResponseDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                RoleName = user.Role.Name.ToString()
            };
        }

        public async Task<UserResponseDTO> CreateAsync(CreateUserDTO dto)
        {
            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = dto.RoleId
            };

            await _repository.CreateAsync(user);
            var created = await _repository.GetByIdAsync(user.UserId);

            return new UserResponseDTO
            {
                UserId = created!.UserId,
                Username = created.Username,
                RoleName = created.Role.Name.ToString()
            };
        }

        public async Task<UserResponseDTO?> UpdateAsync(int id, UpdateUserDTO dto)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null) return null;

            user.Username = dto.Username;
            user.RoleId = dto.RoleId;
            await _repository.UpdateAsync(user);

            var updated = await _repository.GetByIdAsync(id);
            return new UserResponseDTO
            {
                UserId = updated!.UserId,
                Username = updated.Username,
                RoleName = updated.Role.Name.ToString()
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null) return false;

            await _repository.DeleteAsync(user);
            return true;
        }
    }
}