using HealthApp.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthApp.DAL
{
    public class BookingRepository : IBookingRepository
    {
        private readonly BookingDbContext _db;
        private readonly ILogger<BookingRepository> _logger;

        public BookingRepository(BookingDbContext db, ILogger<BookingRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<IEnumerable<Booking>?> GetAll()
        {
            try
            {
                return await _db.Bookings.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[BookingRepository] GetAll failed: {Error}", e.Message);
                return null;
            }
        }

        public async Task<Booking?> GetBookingById(int id)
        {
            try
            {
                return await _db.Bookings.FindAsync(id);
            }
            catch (Exception e)
            {
                _logger.LogError("[BookingRepository] GetBookingById({Id}) failed: {Error}", id, e.Message);
                return null;
            }
        }

        public async Task<IEnumerable<Booking>> GetBookingsByMonthAsync(int year, int month)
        {
            return await _db.Bookings
                .Where(b => b.Date.Year == year && b.Date.Month == month)
                .ToListAsync();
        }

        public async Task<bool> Create(Booking booking)
        {
            try
            {
                await _db.Bookings.AddAsync(booking);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[BookingRepository] Create failed: {Error}", e.Message);
                return false;
            }
        }

        public async Task<bool> Update(Booking booking)
        {
            try
            {
                _db.Bookings.Update(booking);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[BookingRepository] Update({Id}) failed: {Error}", booking.BookingId, e.Message);
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var booking = await _db.Bookings.FindAsync(id);
                if (booking == null)
                {
                    _logger.LogWarning("[BookingRepository] Delete({Id}) failed: not found", id);
                    return false;
                }

                _db.Bookings.Remove(booking);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[BookingRepository] Delete({Id}) failed: {Error}", id, e.Message);
                return false;
            }
        }
    }
}
