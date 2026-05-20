using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Payment>> GetAllAsync()
        {
            return await _context.Payments
                .Include(p => p.Resident)
                .Include(p => p.Invoice)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments
                .Include(p => p.Resident)
                .Include(p => p.Invoice)
                .FirstOrDefaultAsync(p => p.PaymentId == id);
        }

        public async Task<List<Payment>> GetByResidentIdAsync(int residentId)
        {
            return await _context.Payments
                .Include(p => p.Invoice)
                .Where(p => p.ResidentId == residentId)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task CreateAsync(Payment payment)
        {
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Payment payment)
        {
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Payment payment)
        {
            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Payments
                .AnyAsync(p => p.PaymentId == id);
        }
    }
}