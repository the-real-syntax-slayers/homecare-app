using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }

        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}",
            ErrorMessage = "The Name must be numbers or letters and between 2 to 20 characters.")]
        [Display(Name = "Employee name")]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Description { get; set; }

        // Alle bookinger denne ansatte har
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

        // Alle tilgjengelige dager denne ansatte har lagt ut
        public virtual ICollection<AvailableDay> AvailableDays { get; set; } = new List<AvailableDay>();
    }
}
