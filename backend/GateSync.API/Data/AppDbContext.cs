using GateSync.API.Models.Entities;
using GateSync.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GateSync.API.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options)
			: base(options) { }

		public DbSet<Country> Countries { get; set; }
		public DbSet<City> Cities { get; set; }
		public DbSet<Role> Roles { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<Residence> Residences { get; set; }
		public DbSet<Resident> Residents { get; set; }
		public DbSet<Invoice> Invoices { get; set; }
		public DbSet<Payment> Payments { get; set; }
		public DbSet<ProblemReport> ProblemReports { get; set; }
		public DbSet<Reservation> Reservations { get; set; }
		public DbSet<Vehicle> Vehicles { get; set; }
		public DbSet<Notification> Notifications { get; set; }
		public DbSet<Report> Reports { get; set; }
        public DbSet<Neighborhood> Neighborhoods { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

            // Shmang cascade paths te shumefishta në SQL Server
            modelBuilder.Entity<Residence>()
           .HasOne(r => r.Neighborhood)
           .WithMany(n => n.Residences)
           .HasForeignKey(r => r.NeighborhoodId)
           .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
				.HasOne(p => p.Resident)
				.WithMany(r => r.Payments)
				.HasForeignKey(p => p.ResidentId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Payment>()
				.HasOne(p => p.Invoice)
				.WithMany(i => i.Payments)
				.HasForeignKey(p => p.InvoiceId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<ProblemReport>()
				.HasOne(p => p.Resident)
				.WithMany(r => r.ProblemReports)
				.HasForeignKey(p => p.ResidentId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Reservation>()
				.HasOne(r => r.Resident)
				.WithMany(r => r.Reservations)
				.HasForeignKey(r => r.ResidentId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Vehicle>()
				.HasOne(v => v.Resident)
				.WithMany(r => r.Vehicles)
				.HasForeignKey(v => v.ResidentId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Notification>()
				.HasOne(n => n.Resident)
				.WithMany(r => r.Notifications)
				.HasForeignKey(n => n.ResidentId)
				.OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RefreshToken>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            // Enums ruhen si string 
            modelBuilder.Entity<Invoice>()
				.Property(i => i.Status)
				.HasConversion<string>();

			modelBuilder.Entity<Payment>()
				.Property(p => p.Method)
				.HasConversion<string>();

			modelBuilder.Entity<ProblemReport>()
				.Property(p => p.Status)
				.HasConversion<string>();

			modelBuilder.Entity<Reservation>()
				.Property(r => r.Status)
				.HasConversion<string>();

			modelBuilder.Entity<Residence>()
				.Property(r => r.Type)
				.HasConversion<string>();

			modelBuilder.Entity<Role>()
				.Property(r => r.Name)
				.HasConversion<string>();

			// Constraints
			modelBuilder.Entity<User>()
				.HasIndex(u => u.Username)
				.IsUnique();

			modelBuilder.Entity<Resident>()
				.HasIndex(r => r.Email)
				.IsUnique();

			modelBuilder.Entity<Vehicle>()
				.HasIndex(v => v.PlateNumber)
				.IsUnique();

			// Decimal precision per vlera monetare
			modelBuilder.Entity<Invoice>()
				.Property(i => i.Amount)
				.HasPrecision(18, 2);

			modelBuilder.Entity<Payment>()
				.Property(p => p.PaidAmount)
				.HasPrecision(18, 2);

            // Te dhena fillestare per Roles
            modelBuilder.Entity<Role>().HasData(
    new Role { RoleId = 1, Name = UserRole.SuperAdmin },
    new Role { RoleId = 2, Name = UserRole.Admin },
    new Role { RoleId = 3, Name = UserRole.Resident },
    new Role { RoleId = 4, Name = UserRole.Security },
    new Role { RoleId = 5, Name = UserRole.Maintenance }
);
        }
	}
}