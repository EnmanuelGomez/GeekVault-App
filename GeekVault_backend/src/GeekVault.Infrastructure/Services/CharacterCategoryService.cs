using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class CharacterCategoryService : ICharacterCategoryService
    {
        private readonly GeekVaultDbContext _db;

        public CharacterCategoryService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<CharacterCategoryDto>> GetAllAsync()
        {
            return await _db.CharacterTypes  //Character Types = Character Categories
                .AsNoTracking()
                .Select(c => new CharacterCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();
        }
    }
}
