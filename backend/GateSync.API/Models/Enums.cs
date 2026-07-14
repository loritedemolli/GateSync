namespace GateSync.API.Models
{
    public enum InvoiceStatus
    {
        Pending,
        Paid,
        Overdue
    }

    public enum ProblemReportStatus
    {
        Pending,
        InProgress,
        Resolved
    }

    public enum ReservationStatus
    {
        Pending,
        Approved,
        Rejected
    }

    public enum PaymentMethod
    {
        Cash,
        BankTransfer,
        Online
    }

    public enum ResidenceType
    {
        Apartment,
        House
    }

    public enum UserRole
    {
        SuperAdmin,
        Admin,
        Resident,
        Security,
        Maintenance
    }
}