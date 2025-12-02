using Microsoft.EntityFrameworkCore;
using HealthApp.Models;

namespace HealthApp.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        BookingDbContext context = serviceScope.ServiceProvider.GetRequiredService<BookingDbContext>();
        // instead of EnsureDeleted/EnsureCreated, apply migrations:
        try
        {
            context.Database.Migrate();
        }
        catch
        {
            context.Database.EnsureCreated();
        }

        //context.Database.EnsureDeleted();
        //context.Database.EnsureCreated();



        if (!context.Employees.Any())
        {
            var employees = new List<Employee>
            {
                new Employee { Name = "Ansatt"},
            };
            context.AddRange(employees);
            context.SaveChanges();
        }

        if (!context.Patients.Any())
        {
            var patients = new List<Patient>
            {
                new Patient { Name = "Pasient"},
            };
            context.AddRange(patients);
            context.SaveChanges();
        }

        if (!context.Bookings.Any())
        {
            var bookings = new List<Booking>
            {
                new Booking
                {
                    Description = "Vondt i hamstringen",
                    Date = DateTime.Parse("2025-10-10T15:01:00"),
                    PatientId = 1,
                    EmployeeId = 1

                },
                new Booking
                {
                    Description = "Vondt i quaden",
                    Date = DateTime.Parse("2025-10-10T15:01:00"),
                    PatientId = 1,
                    EmployeeId = 1

                }
            };
            context.AddRange(bookings);
            context.SaveChanges();
        }
    }
}