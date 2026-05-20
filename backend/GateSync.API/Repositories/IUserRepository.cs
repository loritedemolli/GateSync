using GateSync.API.Models.Entities;

namespace GateSync.API.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUsernameAsync(string username);
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(User user);
        Task<bool> ExistsAsync(int id);
        Task<bool> UsernameExistsAsync(string username);
    }
}