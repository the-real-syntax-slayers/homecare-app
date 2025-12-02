using System;
using System.ComponentModel.DataAnnotations;

namespace HealthApp.DTOs
{
    public class AvailableDayDto
    {
        public int AvailableDayId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        public string? Notes { get; set; }
    }
}
