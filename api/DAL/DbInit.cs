using Microsoft.EntityFrameworkCore;
using HealthApp.Models;

namespace HealthApp.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        BookingDbContext context = serviceScope.ServiceProvider.GetRequiredService<BookingDbContext>();

        // Apply migrations (safe)
        try
        {
            context.Database.Migrate();
        }
        catch
        {
            context.Database.EnsureCreated();
        }

        // -----------------------------
        // EMPLOYEES
        // -----------------------------
        if (!context.Employees.Any())
        {
            var employees = new List<Employee>
            {
                new Employee { Name = "Ansatt", Description = "Standard employee" }
            };

            context.AddRange(employees);
            context.SaveChanges();
        }

        // -----------------------------
        // PATIENTS
        // -----------------------------
        if (!context.Patients.Any())
        {
            var patients = new List<Patient>
            {
                new Patient { Name = "Pasient", Description = "Standard patient" }
            };

            context.AddRange(patients);
            context.SaveChanges();
        }

        // -----------------------------
        // AVAILABLE DAYS
        // -----------------------------
        if (!context.AvailableDays.Any())
        {
            var availableDays = new List<AvailableDay>
            {
                new AvailableDay
                {
                    Date = DateTime.Parse("2025-10-10"),
                    EmployeeId = 1,
                    Notes = "Formiddag"
                },
                new AvailableDay
                {
                    Date = DateTime.Parse("2025-10-11"),
                    EmployeeId = 1,
                    Notes = "Ettermiddag"
                }
            };

            context.AddRange(availableDays);
            context.SaveChanges();
        }

        // -----------------------------
        // BOOKINGS
        // -----------------------------
        if (!context.Bookings.Any())
        {
            var bookings = new List<Booking>
            {
                new Booking
                {
                    Description = "Vondt i hamstringen",
                    Date = DateTime.Parse("2025-10-10T15:01:00"),
                    PatientId = 1,
                    EmployeeId = 1,
                    AvailableDayId = 1
                },
                new Booking
                {
                    Description = "Vondt i quaden",
                    Date = DateTime.Parse("2025-10-10T16:00:00"),
                    PatientId = 1,
                    EmployeeId = 1,
                    AvailableDayId = 1
                }
            };

            context.AddRange(bookings);
            context.SaveChanges();
        }
    }
}
