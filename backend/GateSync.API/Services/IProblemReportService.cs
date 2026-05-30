using GateSync.API.Models.DTOs.ProblemReport;

namespace GateSync.API.Services
{
    public interface IProblemReportService
    {
        Task<List<ProblemReportResponseDTO>> GetAllAsync();
        Task<ProblemReportResponseDTO?> GetByIdAsync(int id);
        Task<List<ProblemReportResponseDTO>> GetByResidentIdAsync(int residentId);
        Task<ProblemReportResponseDTO> CreateAsync(CreateProblemReportDTO dto);
        Task<ProblemReportResponseDTO?> UpdateAsync(int id, UpdateProblemReportDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}