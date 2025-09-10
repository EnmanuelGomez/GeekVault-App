using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class TeamService : ITeamService
    {
        private readonly GeekVaultDbContext _db;
        public TeamService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<TeamDto>> GetAllAsync(bool includeMembers = false)
        {
            // Proyección directa a DTO para evitar tracking e Includes pesados
            var query = _db.Teams.AsNoTracking();

            return await query
                .Select(t => new TeamDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    FoundedYear = t.FoundedYear,
                    CreatedBy = t.CreatedBy,
                    ImageUrl = t.ImageUrl,
                    MembersCount = t.Memberships.Count,
                    Members = includeMembers
                        ? t.Memberships.Select(m => new TeamMembershipDto
                        {
                            CharacterId = m.CharacterId,
                            RoleInTeam = m.RoleInTeam,
                            JoinDate = m.JoinDate,
                            LeaveDate = m.LeaveDate,
                            // Estos campos asumen que Character tiene Name/ImageUrl
                            CharacterName = m.Character.Name,
                            CharacterImageUrl = m.Character.ImageUrl
                        })
                        : null
                })
                .ToListAsync();
        }

        public async Task<TeamDto?> GetByIdAsync(Guid id, bool includeMembers = false)
        {
            return await _db.Teams
                .AsNoTracking()
                .Where(t => t.Id == id)
                .Select(t => new TeamDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    FoundedYear = t.FoundedYear,
                    CreatedBy = t.CreatedBy,
                    ImageUrl = t.ImageUrl,
                    MembersCount = t.Memberships.Count,
                    Members = includeMembers
                        ? t.Memberships.Select(m => new TeamMembershipDto
                        {
                            CharacterId = m.CharacterId,
                            RoleInTeam = m.RoleInTeam,
                            JoinDate = m.JoinDate,
                            LeaveDate = m.LeaveDate,
                            CharacterName = m.Character.Name,
                            CharacterImageUrl = m.Character.ImageUrl
                        })
                        : null
                })
                .FirstOrDefaultAsync();
        }
    }
}
