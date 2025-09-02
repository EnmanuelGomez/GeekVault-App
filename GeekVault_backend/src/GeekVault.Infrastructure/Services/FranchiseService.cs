using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure.Services
{
    public class FranchiseService : IFranchiseService
    {
        private readonly GeekVaultDbContext _db;

        public FranchiseService(GeekVaultDbContext db) => _db = db;

        public async Task<IEnumerable<FranchiseDto>> GetAllAsync()
        {
            return await _db.Franchises
                .AsNoTracking()
                .Select(f => new FranchiseDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description,
                    OriginCountry = f.OriginCountry,
                    FoundedOn = f.FoundedOn,
                    Founders = f.Founders,
                    ImageUrl = f.ImageUrl
                })
                .ToListAsync();
        }

        public async Task<FranchiseDto?> GetByIdAsync(Guid id)
        {
            return await _db.Franchises
                .AsNoTracking()
                .Where(f => f.Id == id)
                .Select(f => new FranchiseDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description,
                    OriginCountry = f.OriginCountry,
                    FoundedOn = f.FoundedOn,
                    Founders = f.Founders,
                    ImageUrl = f.ImageUrl
                })
                .FirstOrDefaultAsync();
        }


        public async Task<IEnumerable<FranchiseDto>> GetByCategoryAsync(Guid categoryId)
        {
            // Many-to-many: filtramos por la tabla puente FranchiseCategory
            return await _db.FranchiseCategories
                .AsNoTracking()
                .Where(fc => fc.CategoryId == categoryId)
                .Select(fc => new FranchiseDto
                {
                    Id = fc.Franchise.Id,
                    Name = fc.Franchise.Name,
                    Description = fc.Franchise.Description,
                    OriginCountry = fc.Franchise.OriginCountry,
                    FoundedOn = fc.Franchise.FoundedOn,
                    Founders = fc.Franchise.Founders,
                    ImageUrl = fc.Franchise.ImageUrl
                })
                .Distinct() // por seguridad si hubiera duplicados
                .ToListAsync();
        }
    }
}
