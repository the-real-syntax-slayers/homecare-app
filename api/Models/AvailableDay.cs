using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public class AvailableDay
    {
        public int AvailableDayId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }   // selve dagen som er ledig

        [Required]
        public int EmployeeId { get; set; }  // hvem som er tilgjengelig den dagen

        // navigation property
        public virtual Employee Employee { get; set; } = default!;

        [StringLength(200)]
        public string? Notes { get; set; }   // f.eks. "Formiddag", "Kun korte besøk" osv.

        // En dag kan ha flere bookinger
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
