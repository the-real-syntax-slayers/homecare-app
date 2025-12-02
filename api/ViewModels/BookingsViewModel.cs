using HealthApp.Models;

namespace HealthApp.ViewModels
{
    public class BookingsViewModel
    {
        public IEnumerable<Booking> Bookings;
        public string? CurrentViewName;

        public BookingsViewModel(IEnumerable<Booking> bookings, string? currentViewName)
        {
            Bookings = bookings;
            CurrentViewName = currentViewName;
        }
    }
}