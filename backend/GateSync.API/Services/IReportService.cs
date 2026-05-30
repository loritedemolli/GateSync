using GateSync.API.Models.DTOs.Report;

namespace GateSync.API.Services
{
    public interface IReportService
    {
        Task<List<ReportResponseDTO>> GetAllAsync();
        Task<ReportResponseDTO?> GetByIdAsync(int id);
        Task<ReportResponseDTO> CreateAsync(CreateReportDTO dto);
        Task<ReportResponseDTO?> UpdateAsync(int id, UpdateReportDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}