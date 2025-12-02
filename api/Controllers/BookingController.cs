using HealthApp.Models;
using HealthApp.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthApp.DTOs;
using HealthApp.DAL;
using Microsoft.AspNetCore.Authorization;

namespace HealthApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingAPIController : ControllerBase
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ILogger<BookingAPIController> _logger;

    public BookingAPIController(IBookingRepository bookingRepository, ILogger<BookingAPIController> logger)
    {
        _bookingRepository = bookingRepository;
        _logger = logger;
    }
    [HttpGet("bookinglist")]
    public async Task<IActionResult> BookingList()
    {
        var bookings = await _bookingRepository.GetAll();
        if (bookings == null)
        {
            _logger.LogError("[BookingAPIController] Booking list not found while executing _bookingRepository.GetAll()");
            return NotFound("Booking list not found");
        }
        var bookingDtos = bookings.Select(booking => new BookingDto
        {
            BookingId = booking.BookingId,
            Description = booking.Description,
            Date = booking.Date,
            PatientId = booking.PatientId,
            EmployeeId = booking.EmployeeId
        });
        return Ok(bookingDtos);
    }
    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] BookingDto bookingDto)
    {
        if (bookingDto == null)
        {
            return BadRequest("Booking cannot be null");
        }
        var newBooking = new Booking
        {
            Description = bookingDto.Description,
            Date = bookingDto.Date,
            PatientId = bookingDto.PatientId,
            EmployeeId = bookingDto.EmployeeId
        };
        bool returnOk = await _bookingRepository.Create(newBooking);
        if (returnOk)
            return CreatedAtAction(nameof(BookingList), new { id = newBooking.BookingId }, newBooking);

        _logger.LogWarning("[BookingAPIController] Booking creation failed {@booking}", newBooking);
        return StatusCode(500, "Internal server error");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBooking(int id)
    {
        var booking = await _bookingRepository.GetBookingById(id);
        if (booking == null)
        {
            _logger.LogError("[BookingAPIController] Booking not found for the BookingId {BookingId:0000}", id);
            return NotFound("Booking not found for the BookingId");
        }
        return Ok(booking);
    }
    [Authorize]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BookingDto bookingDto)
    {
        if (bookingDto == null)
        {
            return BadRequest("Booking data cannot be null");
        }
        // Find the booking in the database
        var existingBooking = await _bookingRepository.GetBookingById(id);
        if (existingBooking == null)
        {
            return NotFound("Booking not found");
        }
        // Update the booking properties
        existingBooking.Description = bookingDto.Description;
        existingBooking.Date = bookingDto.Date;
        existingBooking.PatientId = bookingDto.PatientId;
        existingBooking.EmployeeId = bookingDto.EmployeeId;
        // Save the changes
        bool updateSuccessful = await _bookingRepository.Update(existingBooking);
        if (updateSuccessful)
        {
            return Ok(existingBooking); // Return the updated booking
        }

        _logger.LogWarning("[BookingAPIController] Booking update failed {@booking}", existingBooking);
        return StatusCode(500, "Internal server error");
    }
    [Authorize]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _bookingRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[BookingAPIController] Booking deletion failed for the BookingId {BookingId:0000}", id);
            return BadRequest("Booking deletion failed");
        }
        return NoContent(); // 200 Ok is commonly used when the server returns a response body with additional information about the result of the request. For a DELETE operation, there's generally no need to return additional data, making 204 NoContent a better fit.
    }

}
public class BookingController : Controller
{

    private readonly IBookingRepository _bookingRepository;
    private readonly ILogger<BookingController> _logger;

    public BookingController(IBookingRepository bookingRepository,
    ILogger<BookingController> logger)
    {
        _bookingRepository = bookingRepository;
        _logger = logger;
    }

    public async Task<IActionResult> Calendar(int? year, int? month)
    {
        _logger.LogInformation("This is an information messeage");
        _logger.LogWarning("This is a warning message");
        _logger.LogError("This is an error message");
        DateTime targetDate;
        //Checking if there is a specific date written in the URL.
        if (year.HasValue && month.HasValue)
        {
            targetDate = new DateTime(year.Value, month.Value, 1);
        }
        else
        {
            targetDate = DateTime.Today;
        }

        // Pass the 1st day of that month to the View.
        // The View will use this for its calendar grid logic.
        DateTime firstDayOfTargetMonth = new DateTime(targetDate.Year, targetDate.Month, 1);
        ViewBag.CalendarDate = firstDayOfTargetMonth;
        ViewBag.CurrentViewName = "Calendar"; // You were doing this via the ViewModel, but we can do it here


        // Instead of getting ALL bookings, we get only the ones for the target month.
        var filteredBookings = await _bookingRepository.GetBookingsByMonthAsync(targetDate.Year, targetDate.Month);

        if (filteredBookings == null)
        {
            _logger.LogError("[BookingController] Booking list not found while executin _bookingRepository.GetAll()");
            return NotFound("Booking list not found");
        }
        // Create the ViewModel using the filtered list of bookings
        var bookingsViewModel = new BookingsViewModel(filteredBookings, "Calendar");

        return View(bookingsViewModel);
    }

    [HttpGet]
    [Authorize]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(Booking booking)
    {

        if (ModelState.IsValid)
        {
            bool returnOk = await _bookingRepository.Create(booking);
            if (returnOk)
                return RedirectToAction(nameof(Calendar));

        }
        _logger.LogWarning("[BookingController] Booking creation failed {@booking}", booking);
        return View(booking);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Update(int id)
    {
        var booking = await _bookingRepository.GetBookingById(id);
        if (booking == null)
        {
            _logger.LogError("[BookingController] Booking not found when updating the BookingId {BookingId:0000}",
            id);
            return BadRequest("Booking not found for the BookingId");
        }
        return View(booking);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Update(Booking booking)
    {
        if (ModelState.IsValid)
        {
            bool returnOk = await _bookingRepository.Update(booking);
            if (returnOk)
                return RedirectToAction(nameof(Calendar));
        }
        _logger.LogWarning("[BookingController] Booking update failed {@booking}", booking);
        return View(booking);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var booking = await _bookingRepository.GetBookingById(id);
        if (booking == null)
        {
            _logger.LogError("[BookingController] Booking not found for the BookingId {BookingId:0000}",
            id);
            return BadRequest("Booking not found for the BookingId");
        }
        return View(booking);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _bookingRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[BookingController] Booking deletion failed for the BookingId {BookingId:0000}",
            id);
            return BadRequest("Booking deletion failed");
        }
        return RedirectToAction(nameof(Calendar));
    }
}