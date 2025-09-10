using GeekVault.Application.DTOs;

namespace GeekVault.Application.Interfaces
{
    public interface ITeamService
    {
        Task<IEnumerable<TeamDto>> GetAllAsync(bool includeMembers = false);
        Task<TeamDto?> GetByIdAsync(Guid id, bool includeMembers = false);
    }
}
