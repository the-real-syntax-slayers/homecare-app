using Microsoft.EntityFrameworkCore;
using HealthApp.Models;

namespace HealthApp.DAL
{
    public class BookingDbContext : DbContext
    {
        public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options)
        {
        }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<AvailableDay> AvailableDays { get; set; } // NEW ENTITY

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }


        // Hvordan Booking, AvailableDay og Employee henger sammen som 1–many relasjoner, 
        // og hva som skjer ved sletting.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Booking → AvailableDay (1–many)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.AvailableDay)
                .WithMany(a => a.Bookings)
                .HasForeignKey(b => b.AvailableDayId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee → AvailableDay (1–many)
            modelBuilder.Entity<AvailableDay>()
                .HasOne(a => a.Employee)
                .WithMany(e => e.AvailableDays)
                .HasForeignKey(a => a.EmployeeId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
