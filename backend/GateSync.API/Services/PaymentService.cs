using GateSync.API.Models.DTOs.Payment;
using GateSync.API.Models.Entities;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repository;

        public PaymentService(IPaymentRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<PaymentResponseDTO>> GetAllAsync()
        {
            var payments = await _repository.GetAllAsync();
            return payments.Select(p => new PaymentResponseDTO
            {
                PaymentId = p.PaymentId,
                PaidAmount = p.PaidAmount,
                PaymentDate = p.PaymentDate,
                Method = p.Method.ToString(),
                ResidentName = p.Resident.FullName,
                InvoiceAmount = p.Invoice.Amount
            }).ToList();
        }

        public async Task<PaymentResponseDTO?> GetByIdAsync(int id)
        {
            var payment = await _repository.GetByIdAsync(id);
            if (payment == null) return null;

            return new PaymentResponseDTO
            {
                PaymentId = payment.PaymentId,
                PaidAmount = payment.PaidAmount,
                PaymentDate = payment.PaymentDate,
                Method = payment.Method.ToString(),
                ResidentName = payment.Resident.FullName,
                InvoiceAmount = payment.Invoice.Amount
            };
        }

        public async Task<List<PaymentResponseDTO>> GetByResidentIdAsync(int residentId)
        {
            var payments = await _repository.GetByResidentIdAsync(residentId);
            return payments.Select(p => new PaymentResponseDTO
            {
                PaymentId = p.PaymentId,
                PaidAmount = p.PaidAmount,
                PaymentDate = p.PaymentDate,
                Method = p.Method.ToString(),
                ResidentName = p.Resident.FullName,
                InvoiceAmount = p.Invoice.Amount
            }).ToList();
        }

        public async Task<PaymentResponseDTO> CreateAsync(CreatePaymentDTO dto)
        {
            var payment = new Payment
            {
                PaidAmount = dto.PaidAmount,
                PaymentDate = DateTime.UtcNow,
                Method = dto.Method,
                InvoiceId = dto.InvoiceId,
                ResidentId = dto.ResidentId
            };

            await _repository.CreateAsync(payment);
            var created = await _repository.GetByIdAsync(payment.PaymentId);

            return new PaymentResponseDTO
            {
                PaymentId = created!.PaymentId,
                PaidAmount = created.PaidAmount,
                PaymentDate = created.PaymentDate,
                Method = created.Method.ToString(),
                ResidentName = created.Resident.FullName,
                InvoiceAmount = created.Invoice.Amount
            };
        }

        public async Task<PaymentResponseDTO?> UpdateAsync(int id, UpdatePaymentDTO dto)
        {
            var payment = await _repository.GetByIdAsync(id);
            if (payment == null) return null;

            payment.PaidAmount = dto.PaidAmount;
            payment.Method = dto.Method;
            await _repository.UpdateAsync(payment);

            var updated = await _repository.GetByIdAsync(id);
            return new PaymentResponseDTO
            {
                PaymentId = updated!.PaymentId,
                PaidAmount = updated.PaidAmount,
                PaymentDate = updated.PaymentDate,
                Method = updated.Method.ToString(),
                ResidentName = updated.Resident.FullName,
                InvoiceAmount = updated.Invoice.Amount
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var payment = await _repository.GetByIdAsync(id);
            if (payment == null) return false;

            await _repository.DeleteAsync(payment);
            return true;
        }
    }
}