using HealthApp.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthApp.DAL
{
    public static class DBInit
    {
        public static void Seed(IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<BookingDbContext>();

            // Sikrer at migrasjoner er kjørt
            context.Database.Migrate();

            // Hvis vi allerede har data, gjør ingenting
            if (context.Employees.Any() || context.Patients.Any() || context.AvailableDays.Any())
            {
                return;
            }

            // --------- Employees ---------
            var employee1 = new Employee
            {
                Name = "Anna",
                Description = "Andersen"
            };

            var employee2 = new Employee
            {
                Name = "Gushi",
                Description = "Andersen"
            };

            context.Employees.AddRange(employee1, employee2);
            context.SaveChanges();

            // --------- Patients ---------
            var patient1 = new Patient
            {
                Name = "klient",
                Description = "Andersen"
            };

            var patient2 = new Patient
            {
                Name = "klient2",
                Description = "Andersen"
            };

            context.Patients.AddRange(patient1, patient2);
            context.SaveChanges();

            // --------- AvailableDays ---------
            var day1 = new AvailableDay
            {
                Date = new DateTime(2025, 10, 10),
                EmployeeId = employee1.EmployeeId,
                Notes = "Formiddag"
            };

            var day2 = new AvailableDay
            {
                Date = new DateTime(2025, 10, 11),
                EmployeeId = employee1.EmployeeId,
                Notes = "Ettermiddag"
            };

            context.AvailableDays.AddRange(day1, day2);
            context.SaveChanges();

            // Ingen Bookings seedes her – de opprettes via frontend
        }
    }
}
