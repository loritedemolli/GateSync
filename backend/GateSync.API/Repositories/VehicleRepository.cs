using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly AppDbContext _context;

        public VehicleRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Vehicle>> GetAllAsync()
        {
            return await _context.Vehicles
                .Include(v => v.Resident)
                .OrderBy(v => v.PlateNumber)
                .ToListAsync();
        }

        public async Task<Vehicle?> GetByIdAsync(int id)
        {
            return await _context.Vehicles
                .Include(v => v.Resident)
                .FirstOrDefaultAsync(v => v.VehicleId == id);
        }

        public async Task<List<Vehicle>> GetByResidentIdAsync(int residentId)
        {
            return await _context.Vehicles
                .Where(v => v.ResidentId == residentId)
                .ToListAsync();
        }

        public async Task CreateAsync(Vehicle vehicle)
        {
            await _context.Vehicles.AddAsync(vehicle);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Vehicle vehicle)
        {
            _context.Vehicles.Update(vehicle);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Vehicle vehicle)
        {
            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Vehicles
                .AnyAsync(v => v.VehicleId == id);
        }

        public async Task<bool> PlateNumberExistsAsync(string plateNumber)
        {
            return await _context.Vehicles
                .AnyAsync(v => v.PlateNumber == plateNumber);
        }
    }
}