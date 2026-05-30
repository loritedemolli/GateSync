using GateSync.API.Models.DTOs.ProblemReport;
using GateSync.API.Models.Entities;
using GateSync.API.Models;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class ProblemReportService : IProblemReportService
    {
        private readonly IProblemReportRepository _repository;

        public ProblemReportService(IProblemReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ProblemReportResponseDTO>> GetAllAsync()
        {
            var reports = await _repository.GetAllAsync();
            return reports.Select(p => new ProblemReportResponseDTO
            {
                ProblemReportId = p.ProblemReportId,
                Title = p.Title,
                Description = p.Description,
                ReportedAt = p.ReportedAt,
                Status = p.Status.ToString(),
                ResidentName = p.Resident.FullName
            }).ToList();
        }

        public async Task<ProblemReportResponseDTO?> GetByIdAsync(int id)
        {
            var report = await _repository.GetByIdAsync(id);
            if (report == null) return null;

            return new ProblemReportResponseDTO
            {
                ProblemReportId = report.ProblemReportId,
                Title = report.Title,
                Description = report.Description,
                ReportedAt = report.ReportedAt,
                Status = report.Status.ToString(),
                ResidentName = report.Resident.FullName
            };
        }

        public async Task<List<ProblemReportResponseDTO>> GetByResidentIdAsync(int residentId)
        {
            var reports = await _repository.GetByResidentIdAsync(residentId);
            return reports.Select(p => new ProblemReportResponseDTO
            {
                ProblemReportId = p.ProblemReportId,
                Title = p.Title,
                Description = p.Description,
                ReportedAt = p.ReportedAt,
                Status = p.Status.ToString(),
                ResidentName = p.Resident.FullName
            }).ToList();
        }

        public async Task<ProblemReportResponseDTO> CreateAsync(CreateProblemReportDTO dto)
        {
            var report = new ProblemReport
            {
                Title = dto.Title,
                Description = dto.Description,
                ReportedAt = DateTime.UtcNow,
                Status = ProblemReportStatus.Pending,
                ResidentId = dto.ResidentId
            };

            await _repository.CreateAsync(report);
            var created = await _repository.GetByIdAsync(report.ProblemReportId);

            return new ProblemReportResponseDTO
            {
                ProblemReportId = created!.ProblemReportId,
                Title = created.Title,
                Description = created.Description,
                ReportedAt = created.ReportedAt,
                Status = created.Status.ToString(),
                ResidentName = created.Resident.FullName
            };
        }

        public async Task<ProblemReportResponseDTO?> UpdateAsync(int id, UpdateProblemReportDTO dto)
        {
            var report = await _repository.GetByIdAsync(id);
            if (report == null) return null;

            report.Title = dto.Title;
            report.Description = dto.Description;
            report.Status = dto.Status;
            await _repository.UpdateAsync(report);

            var updated = await _repository.GetByIdAsync(id);
            return new ProblemReportResponseDTO
            {
                ProblemReportId = updated!.ProblemReportId,
                Title = updated.Title,
                Description = updated.Description,
                ReportedAt = updated.ReportedAt,
                Status = updated.Status.ToString(),
                ResidentName = updated.Resident.FullName
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