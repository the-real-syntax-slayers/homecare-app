using HealthApp.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthApp.DAL
{
    public class AvailableDayRepository : IAvailableDayRepository
    {
        private readonly BookingDbContext _db;
        private readonly ILogger<AvailableDayRepository> _logger;

        public AvailableDayRepository(BookingDbContext db, ILogger<AvailableDayRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<IEnumerable<AvailableDay>?> GetAll()
        {
            try
            {
                return await _db.AvailableDays.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[AvailableDayRepository] GetAll() failed: {Message}", e.Message);
                return null;
            }
        }

        public async Task<AvailableDay?> GetById(int id)
        {
            try
            {
                return await _db.AvailableDays.FindAsync(id);
            }
            catch (Exception e)
            {
                _logger.LogError("[AvailableDayRepository] GetById({Id}) failed: {Message}", id, e.Message);
                return null;
            }
        }

        public async Task<bool> Create(AvailableDay availableDay)
        {
            try
            {
                _db.AvailableDays.Add(availableDay);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[AvailableDayRepository] Create() failed: {Message}", e.Message);
                return false;
            }
        }

        public async Task<bool> Update(AvailableDay availableDay)
        {
            try
            {
                _db.AvailableDays.Update(availableDay);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[AvailableDayRepository] Update() failed: {Message}", e.Message);
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var day = await _db.AvailableDays.FindAsync(id);
                if (day == null)
                {
                    return false;
                }

                _db.AvailableDays.Remove(day);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[AvailableDayRepository] Delete({Id}) failed: {Message}", id, e.Message);
                return false;
            }
        }
    }
}
