using GateSync.API.Models.DTOs.Payment;

namespace GateSync.API.Services
{
    public interface IPaymentService
    {
        Task<List<PaymentResponseDTO>> GetAllAsync();
        Task<PaymentResponseDTO?> GetByIdAsync(int id);
        Task<List<PaymentResponseDTO>> GetByResidentIdAsync(int residentId);
        Task<PaymentResponseDTO> CreateAsync(CreatePaymentDTO dto);
        Task<PaymentResponseDTO?> UpdateAsync(int id, UpdatePaymentDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}