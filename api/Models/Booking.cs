using System;
using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public class Booking
    {
        public int BookingId { get; set; }

        // Her kan dere skrive konkrete tasks: "Handle", "Medisin", osv.
        [StringLength(200)]
        public string? Description { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }

        // Kobling til AvailableDay (entitet 1)
        [Required]
        public int AvailableDayId { get; set; }
        public virtual AvailableDay AvailableDay { get; set; } = default!;

        [Required]
        public int PatientId { get; set; }
        public virtual Patient Patient { get; set; } = default!;

        [Required]
        public int EmployeeId { get; set; }
        public virtual Employee Employee { get; set; } = default!;
    }
}
