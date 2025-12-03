using System.ComponentModel.DataAnnotations;

namespace HealthApp.DTOs
{
    public class BookingDto
    {
        public int BookingId { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public int? AvailableDayId { get; set; }
    }
}
