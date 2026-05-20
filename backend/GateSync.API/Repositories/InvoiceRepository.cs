using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly AppDbContext _context;

        public InvoiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Invoice>> GetAllAsync()
        {
            return await _context.Invoices
                .Include(i => i.Residence)
                .OrderByDescending(i => i.DueDate)
                .ToListAsync();
        }

        public async Task<Invoice?> GetByIdAsync(int id)
        {
            return await _context.Invoices
                .Include(i => i.Residence)
                .FirstOrDefaultAsync(i => i.InvoiceId == id);
        }

        public async Task<List<Invoice>> GetByResidenceIdAsync(int residenceId)
        {
            return await _context.Invoices
                .Include(i => i.Residence)
                .Where(i => i.ResidenceId == residenceId)
                .OrderByDescending(i => i.DueDate)
                .ToListAsync();
        }

        public async Task CreateAsync(Invoice invoice)
        {
            await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Invoice invoice)
        {
            _context.Invoices.Update(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Invoice invoice)
        {
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Invoices
                .AnyAsync(i => i.InvoiceId == id);
        }
    }
}