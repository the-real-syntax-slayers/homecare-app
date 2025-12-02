using HealthApp.DAL;
using HealthApp.DTOs;
using HealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailableDaysController : ControllerBase
    {
        private readonly IAvailableDayRepository _availableDayRepository;
        private readonly ILogger<AvailableDaysController> _logger;

        public AvailableDaysController(
            IAvailableDayRepository availableDayRepository,
            ILogger<AvailableDaysController> logger)
        {
            _availableDayRepository = availableDayRepository;
            _logger = logger;
        }

        // GET: api/availabledays
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var days = await _availableDayRepository.GetAll();

            if (days == null)
            {
                _logger.LogError("[AvailableDaysController] Available days list not found in GetAll()");
                return NotFound("Available days list not found");
            }

            var dtos = days.Select(d => new AvailableDayDto
            {
                AvailableDayId = d.AvailableDayId,
                Date = d.Date,
                EmployeeId = d.EmployeeId,
                Notes = d.Notes
            });

            return Ok(dtos);
        }

        // GET: api/availabledays/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var day = await _availableDayRepository.GetById(id);

            if (day == null)
            {
                _logger.LogError("[AvailableDaysController] Available day not found for id {AvailableDayId}", id);
                return NotFound("Available day not found");
            }

            var dto = new AvailableDayDto
            {
                AvailableDayId = day.AvailableDayId,
                Date = day.Date,
                EmployeeId = day.EmployeeId,
                Notes = day.Notes
            };

            return Ok(dto);
        }

        // POST: api/availabledays
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AvailableDayDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Available day cannot be null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var day = new AvailableDay
            {
                Date = dto.Date,
                EmployeeId = dto.EmployeeId,
                Notes = dto.Notes
            };

            var created = await _availableDayRepository.Create(day);

            if (!created)
            {
                _logger.LogWarning("[AvailableDaysController] Available day creation failed {@day}", day);
                return StatusCode(500, "Internal server error while creating available day");
            }

            dto.AvailableDayId = day.AvailableDayId;

            return CreatedAtAction(nameof(GetById), new { id = day.AvailableDayId }, dto);
        }

        // PUT: api/availabledays/5
        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AvailableDayDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Available day data cannot be null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _availableDayRepository.GetById(id);

            if (existing == null)
            {
                return NotFound("Available day not found");
            }

            existing.Date = dto.Date;
            existing.EmployeeId = dto.EmployeeId;
            existing.Notes = dto.Notes;

            var updated = await _availableDayRepository.Update(existing);

            if (!updated)
            {
                _logger.LogWarning("[AvailableDaysController] Available day update failed {@day}", existing);
                return StatusCode(500, "Internal server error while updating available day");
            }

            return Ok(dto);
        }

        // DELETE: api/availabledays/5
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _availableDayRepository.Delete(id);

            if (!deleted)
            {
                _logger.LogError("[AvailableDaysController] Available day deletion failed for id {AvailableDayId}", id);
                return BadRequest("Available day deletion failed");
            }

            return NoContent();
        }
    }
}
