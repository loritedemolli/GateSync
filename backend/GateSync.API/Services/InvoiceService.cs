using GateSync.API.Models.DTOs.Invoice;
using GateSync.API.Models.Entities;
using GateSync.API.Models;
using GateSync.API.Repositories;

namespace GateSync.API.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _repository;

        public InvoiceService(IInvoiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<InvoiceResponseDTO>> GetAllAsync()
        {
            var invoices = await _repository.GetAllAsync();
            return invoices.Select(i => new InvoiceResponseDTO
            {
                InvoiceId = i.InvoiceId,
                Amount = i.Amount,
                DueDate = i.DueDate,
                Status = i.Status.ToString(),
                ResidenceAddress = i.Residence.Address
            }).ToList();
        }

        public async Task<InvoiceResponseDTO?> GetByIdAsync(int id)
        {
            var invoice = await _repository.GetByIdAsync(id);
            if (invoice == null) return null;

            return new InvoiceResponseDTO
            {
                InvoiceId = invoice.InvoiceId,
                Amount = invoice.Amount,
                DueDate = invoice.DueDate,
                Status = invoice.Status.ToString(),
                ResidenceAddress = invoice.Residence.Address
            };
        }

        public async Task<List<InvoiceResponseDTO>> GetByResidenceIdAsync(int residenceId)
        {
            var invoices = await _repository.GetByResidenceIdAsync(residenceId);
            return invoices.Select(i => new InvoiceResponseDTO
            {
                InvoiceId = i.InvoiceId,
                Amount = i.Amount,
                DueDate = i.DueDate,
                Status = i.Status.ToString(),
                ResidenceAddress = i.Residence.Address
            }).ToList();
        }

        public async Task<InvoiceResponseDTO> CreateAsync(CreateInvoiceDTO dto)
        {
            var invoice = new Invoice
            {
                Amount = dto.Amount,
                DueDate = dto.DueDate,
                Status = InvoiceStatus.Pending,
                ResidenceId = dto.ResidenceId
            };

            await _repository.CreateAsync(invoice);
            var created = await _repository.GetByIdAsync(invoice.InvoiceId);

            return new InvoiceResponseDTO
            {
                InvoiceId = created!.InvoiceId,
                Amount = created.Amount,
                DueDate = created.DueDate,
                Status = created.Status.ToString(),
                ResidenceAddress = created.Residence.Address
            };
        }

        public async Task<InvoiceResponseDTO?> UpdateAsync(int id, UpdateInvoiceDTO dto)
        {
            var invoice = await _repository.GetByIdAsync(id);
            if (invoice == null) return null;

            invoice.Amount = dto.Amount;
            invoice.DueDate = dto.DueDate;
            invoice.Status = dto.Status;
            await _repository.UpdateAsync(invoice);

            var updated = await _repository.GetByIdAsync(id);
            return new InvoiceResponseDTO
            {
                InvoiceId = updated!.InvoiceId,
                Amount = updated.Amount,
                DueDate = updated.DueDate,
                Status = updated.Status.ToString(),
                ResidenceAddress = updated.Residence.Address
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var invoice = await _repository.GetByIdAsync(id);
            if (invoice == null) return false;

            await _repository.DeleteAsync(invoice);
            return true;
        }
    }
}