namespace GateSync.API.Models.Entities
{
    public class Role
    {
        public int RoleId { get; set; }
        public UserRole Name { get; set; }

        // Nje Role mund ta kenë shume Users
        public ICollection<User> Users { get; set; } 
            = new List<User>();
    }
}