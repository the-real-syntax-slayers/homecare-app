using System;
using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public class Booking
    {
        public int BookingId { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }

        [Required]
        public int PatientId { get; set; }

        // navigation property
        public virtual Patient Patient { get; set; } = default!;

        [Required]
        public int EmployeeId { get; set; }

        // navigation property
        public virtual Employee Employee { get; set; } = default!;

    }

}