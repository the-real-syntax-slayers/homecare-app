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
                _logger.LogError("[BookingRepository] bookings ToListAsync() failed when GetAll(), error message: {e}",
                e.Message);
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
                _logger.LogError("[BookingRepository] booking FindAsync(id) failed when GetBookingById, for BookingId {BookingId:0000}, error message: {e}",
                id, e.Message);
                return null;
            }

        }

        // This is for filtering on the database
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
                _db.Bookings.Add(booking);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[BookingRepository] booking creation failed for booking {@booking}, error message: {e}",
                booking, e.Message);
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
                _logger.LogError("[BookingRepository] booking FindAsync(id) failed when updating the BookingId {BookingId:0000}, error message: {e}",
                booking, e.Message);
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
                    _logger.LogError("[BookingRepository] booking  not found for BookingId {BookingId:0000}",
                     id);
                    return false;
                }

                _db.Bookings.Remove(booking);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[BookingRepository] booking deletion failed found for BookingId {BookingId:0000}, error message: {e}",
                id, e.Message);
                return false;
            }


        }
    }
}