using HealthApp.Models;

namespace HealthApp.DAL
{
    public interface IAvailableDayRepository
    {
        Task<IEnumerable<AvailableDay>?> GetAll();
        Task<AvailableDay?> GetById(int id);
        Task<bool> Create(AvailableDay availableDay);
        Task<bool> Update(AvailableDay availableDay);
        Task<bool> Delete(int id);
    }
}
