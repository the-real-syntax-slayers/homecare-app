using HealthApp.DAL;
using HealthApp.DTOs;
using HealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(
            IBookingRepository bookingRepository,
            ILogger<BookingsController> logger)
        {
            _bookingRepository = bookingRepository;
            _logger = logger;
        }

        // GET: api/bookings
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bookings = await _bookingRepository.GetAll();

            if (bookings == null)
            {
                _logger.LogError("[BookingsController] Booking list not found in GetAll()");
                return NotFound("Booking list not found");
            }

            var dtos = bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                Description = b.Description,
                Date = b.Date,
                PatientId = b.PatientId,
                EmployeeId = b.EmployeeId,
                AvailableDayId = b.AvailableDayId
            });

            return Ok(dtos);
        }

        // GET: api/bookings/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _bookingRepository.GetBookingById(id);

            if (booking == null)
            {
                _logger.LogError("[BookingsController] Booking not found for id {BookingId}", id);
                return NotFound("Booking not found");
            }

            var dto = new BookingDto
            {
                BookingId = booking.BookingId,
                Description = booking.Description,
                Date = booking.Date,
                PatientId = booking.PatientId,
                EmployeeId = booking.EmployeeId,
                AvailableDayId = booking.AvailableDayId
            };

            return Ok(dto);
        }

        // Optional: filter by year/month
        // GET: api/bookings/by-month?year=2025&month=10
        [HttpGet("by-month")]
        public async Task<IActionResult> GetByMonth([FromQuery] int year, [FromQuery] int month)
        {
            var bookings = await _bookingRepository.GetBookingsByMonthAsync(year, month);

            var dtos = bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                Description = b.Description,
                Date = b.Date,
                PatientId = b.PatientId,
                EmployeeId = b.EmployeeId,
                AvailableDayId = b.AvailableDayId
            });

            return Ok(dtos);
        }

        // POST: api/bookings
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BookingDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Booking cannot be null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var booking = new Booking
            {
                Description = dto.Description,
                Date = dto.Date,
                PatientId = dto.PatientId,
                EmployeeId = dto.EmployeeId,
                AvailableDayId = dto.AvailableDayId
            };

            var created = await _bookingRepository.Create(booking);

            if (!created)
            {
                _logger.LogWarning("[BookingsController] Booking creation failed {@booking}", booking);
                return StatusCode(500, "Internal server error while creating booking");
            }

            dto.BookingId = booking.BookingId;

            return CreatedAtAction(nameof(GetById), new { id = booking.BookingId }, dto);
        }

        // PUT: api/bookings/5
        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] BookingDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Booking data cannot be null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _bookingRepository.GetBookingById(id);

            if (existing == null)
            {
                return NotFound("Booking not found");
            }

            existing.Description = dto.Description;
            existing.Date = dto.Date;
            existing.PatientId = dto.PatientId;
            existing.EmployeeId = dto.EmployeeId;
            existing.AvailableDayId = dto.AvailableDayId;

            var updated = await _bookingRepository.Update(existing);

            if (!updated)
            {
                _logger.LogWarning("[BookingsController] Booking update failed {@booking}", existing);
                return StatusCode(500, "Internal server error while updating booking");
            }

            return Ok(dto);
        }

        // DELETE: api/bookings/5
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _bookingRepository.Delete(id);

            if (!deleted)
            {
                _logger.LogError("[BookingsController] Booking deletion failed for id {BookingId}", id);
                return BadRequest("Booking deletion failed");
            }

            return NoContent();
        }
    }
}
