using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly AppDbContext _context;

        public ReservationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Reservation>> GetAllAsync()
        {
            return await _context.Reservations
                .Include(r => r.Resident)
                .OrderByDescending(r => r.Time)
                .ToListAsync();
        }

        public async Task<Reservation?> GetByIdAsync(int id)
        {
            return await _context.Reservations
                .Include(r => r.Resident)
                .FirstOrDefaultAsync(r => r.ReservationId == id);
        }

        public async Task<List<Reservation>> GetByResidentIdAsync(int residentId)
        {
            return await _context.Reservations
                .Where(r => r.ResidentId == residentId)
                .OrderByDescending(r => r.Time)
                .ToListAsync();
        }

        public async Task CreateAsync(Reservation reservation)
        {
            await _context.Reservations.AddAsync(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Reservation reservation)
        {
            _context.Reservations.Update(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Reservation reservation)
        {
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Reservations
                .AnyAsync(r => r.ReservationId == id);
        }
    }
}