using GateSync.API.Models.DTOs.Report;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;

        public ReportService(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ReportResponseDTO>> GetAllAsync()
        {
            var reports = await _repository.GetAllAsync();
            return reports.Select(r => new ReportResponseDTO
            {
                ReportId = r.ReportId,
                Title = r.Title,
                ReportType = r.ReportType,
                GeneratedAt = r.GeneratedAt,
                GeneratedByUsername = r.GeneratedBy.Username
            }).ToList();
        }

        public async Task<ReportResponseDTO?> GetByIdAsync(int id)
        {
            var report = await _repository.GetByIdAsync(id);
            if (report == null) return null;

            return new ReportResponseDTO
            {
                ReportId = report.ReportId,
                Title = report.Title,
                ReportType = report.ReportType,
                GeneratedAt = report.GeneratedAt,
                GeneratedByUsername = report.GeneratedBy.Username
            };
        }

        public async Task<ReportResponseDTO> CreateAsync(CreateReportDTO dto)
        {
            var report = new Report
            {
                Title = dto.Title,
                ReportType = dto.ReportType,
                GeneratedByUserId = dto.GeneratedByUserId,
                GeneratedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(report);
            var created = await _repository.GetByIdAsync(report.ReportId);

            return new ReportResponseDTO
            {
                ReportId = created!.ReportId,
                Title = created.Title,
                ReportType = created.ReportType,
                GeneratedAt = created.GeneratedAt,
                GeneratedByUsername = created.GeneratedBy.Username
            };
        }

        public async Task<ReportResponseDTO?> UpdateAsync(int id, UpdateReportDTO dto)
        {
            var report = await _repository.GetByIdAsync(id);
            if (report == null) return null;

            report.Title = dto.Title;
            report.ReportType = dto.ReportType;
            await _repository.UpdateAsync(report);

            var updated = await _repository.GetByIdAsync(id);
            return new ReportResponseDTO
            {
                ReportId = updated!.ReportId,
                Title = updated.Title,
                ReportType = updated.ReportType,
                GeneratedAt = updated.GeneratedAt,
                GeneratedByUsername = updated.GeneratedBy.Username
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var report = await _repository.GetByIdAsync(id);
            if (report == null) return false;

            await _repository.DeleteAsync(report);
            return true;
        }
    }
}