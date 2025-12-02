using System;
using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public class Patient
    {
        public int PatientId { get; set; }
        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Name must be numbers or letters and between 2 to 20 characters.")]
        [Display(Name = "Patient name")]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Description { get; set; }

        // navigation property
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

}

