using GateSync.API.Data;
using GateSync.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Repositories
{
    public class ProblemReportRepository : IProblemReportRepository
    {
        private readonly AppDbContext _context;

        public ProblemReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProblemReport>> GetAllAsync()
        {
            return await _context.ProblemReports
                .Include(p => p.Resident)
                .OrderByDescending(p => p.ReportedAt)
                .ToListAsync();
        }

        public async Task<ProblemReport?> GetByIdAsync(int id)
        {
            return await _context.ProblemReports
                .Include(p => p.Resident)
                .FirstOrDefaultAsync(p => p.ProblemReportId == id);
        }

        public async Task<List<ProblemReport>> GetByResidentIdAsync(int residentId)
        {
            return await _context.ProblemReports
                .Where(p => p.ResidentId == residentId)
                .OrderByDescending(p => p.ReportedAt)
                .ToListAsync();
        }

        public async Task CreateAsync(ProblemReport problemReport)
        {
            await _context.ProblemReports.AddAsync(problemReport);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProblemReport problemReport)
        {
            _context.ProblemReports.Update(problemReport);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ProblemReport problemReport)
        {
            _context.ProblemReports.Remove(problemReport);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.ProblemReports
                .AnyAsync(p => p.ProblemReportId == id);
        }
    }
}