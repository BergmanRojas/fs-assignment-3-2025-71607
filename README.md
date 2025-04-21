# Hospital Appointment System

A full-stack web application that allows patients to book appointments with doctors, while administrators manage doctors and schedules. Developed as part of the assignment **fs-assignment-3-2025-71607**.

---

## 🔧 Technologies Used

- **Backend**: ASP.NET Core (.NET 8)
- **Frontend**: Angular (integrated separately)
- **Database**: SQL Server (Relational DB hosted on Azure)
- **Authentication**: Azure AD B2C (`hospitalb2c.onmicrosoft.com`)
- **ORM**: Entity Framework Core
- **Messaging Queue**: Microsoft Service Bus or RabbitMQ *(in progress)*
- **Test Data Generation**: Bogus (used to insert 1000+ fake patients)

---

## ✅ Key Features

### 🧑‍⚕️ Role-based Access

- **Patients**:
  - Register, log in with Azure AD B2C
  - Book, view, and cancel appointments (at least 48h before)
- **Doctors**:
  - Log in, view their appointments
  - Approve / reject appointments
  - Write prescriptions
- **Admins**:
  - Manage doctors, patients, and appointments

### 📅 Appointment Management

- Prevents double booking and conflicting schedules
- Validation to disallow cancellation within 48 hours of appointment

### 📬 Notifications

- Email notifications sent upon booking or cancellation
- Reminder system under integration (event-based messaging system)

### 🔍 Search & Filtering

- Filter appointments by:
  - Date
  - Doctor
  - Status
- Search doctors by name or specialization

---

## 🛡️ Security & Best Practices

- Microsoft Identity integration for secure login
- Passwords hashed and stored securely (Azure AD B2C)
- Role-based authorization throughout API
- EF Core with parameterized queries to prevent SQL Injection

---

## 🚀 Deployment & Infrastructure

- Azure SQL used for hosting the relational database
- API planned to be deployed on Azure App Service
- Azure AD B2C tenant active: `hospitalb2c.onmicrosoft.com`
- Azure Service Bus or RabbitMQ planned for messaging

---

## 📂 Project Structure

src/
├── Application/
├── Domain/
├── Infrastructure/
├── Persistence/
├── WebAPI/
└── Hospital.bak (SQL Backup)

---

## 📌 Project Requirements Mapping

| Requirement                          | Status    |
|--------------------------------------|-----------|
| .NET API backend                     | ✅ Done    |
| SQL Server relational DB             | ✅ Done    |
| Microsoft Identity or B2C auth       | ✅ Configured |
| Messaging System (RabbitMQ / Bus)    | ⚠️ Pending |
| Faker/Bogus for patient seeding      | ✅ Done    |
| Prevent cancellation within 48h      | ✅ Done    |
| Admin/Doctor/Patient roles           | ✅ Done    |
| Search & filtering                   | ✅ Done    |
| Event-based notifications            | ⚠️ In progress |

---

## 📬 Contact

Developed by **Bergman Fernando Rojas Carrasco**

- Email: bfrojasc@gmail.com
- GitHub: [@BergmanRojas](https://github.com/BergmanRojas)
