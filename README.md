# GateSync — Neighborhood Management System

GateSync is a full-stack web application for managing closed residential neighborhoods. It provides a centralized digital platform for administrators, residents, security, and maintenance staff — covering resident registration, invoices, payments, reservations, vehicle registry, problem reporting, and notifications.

---

## Tech Stack

**Backend:** ASP.NET Core Web API (.NET 10) · Entity Framework Core · SQL Server · JWT · BCrypt.Net

**Frontend:** React 19 · Vite · Tailwind CSS · Axios · React Router DOM · React Context API

---

## Architecture

The backend follows a three-layer architecture — Controllers handle requests and authorization, Services contain business logic, Repositories manage database access through Entity Framework Core.

The frontend uses Axios interceptors to attach JWT tokens automatically and handle silent token refresh on expiry.

---

## Data Model

Entities: Country, City, Neighborhood, Residence, Resident, User, Role, Invoice, Payment, ProblemReport, Reservation, Vehicle, Notification, Report, RefreshToken

---

## Authentication

Dual-token JWT strategy — access tokens expire in 60 minutes, refresh tokens in 7 days with automatic rotation. Passwords are hashed with BCrypt.

---

## Roles

**SuperAdmin** — full access. **Admin** — manages residents, residences, invoices, payments, reservations, problem reports, notifications. **Resident** — manages own profile, invoices, payments, reservations, vehicles, problem reports. **Security** — views residents and vehicles. **Maintenance** — views and updates problem reports.

Authorization is enforced at the controller level using `[Authorize(Roles = "...")]`, following the principle of least privilege.

---

## Installation

**Prerequisites:** .NET 10 SDK · Node.js 18+ · SQL Server · Git

**Backend**

```bash
git clone https://github.com/loritedemolli/GateSync.git
cd GateSync/backend/GateSync.API
```

Copy `appsettings.example.json` to `appsettings.json` and configure your values:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GateSyncDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-minimum-32-characters",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  }
}
```

```bash
dotnet ef database update
dotnet run
```

**Frontend**

```bash
cd GateSync/frontend
npm install
npm run dev
```

---

## Author

Lorita Demolli — University Lab Project 2025/2026
