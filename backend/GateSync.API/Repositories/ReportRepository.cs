using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Report>> GetAllAsync()
        {
            return await _context.Reports
                .Include(r => r.GeneratedBy)
                .OrderByDescending(r => r.GeneratedAt)
                .ToListAsync();
        }

        public async Task<Report?> GetByIdAsync(int id)
        {
            return await _context.Reports
                .Include(r => r.GeneratedBy)
                .FirstOrDefaultAsync(r => r.ReportId == id);
        }

        public async Task CreateAsync(Report report)
        {
            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Report report)
        {
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Report report)
        {
            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Reports
                .AnyAsync(r => r.ReportId == id);
        }
    }
}