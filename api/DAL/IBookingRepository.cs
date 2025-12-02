using HealthApp.Models;

namespace HealthApp.DAL
{
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>?> GetAll();
        Task<Booking?> GetBookingById(int id);
        //filter method
        Task<IEnumerable<Booking>> GetBookingsByMonthAsync(int year, int month);
        Task<bool> Create(Booking booking);
        Task<bool> Update(Booking booking);
        Task<bool> Delete(int id);
    }
}