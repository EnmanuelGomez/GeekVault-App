using GeekVault.Application.DTOs;
using GeekVault.Application.Interfaces;
using GeekVault.Domain.Entities;
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

        public async Task<FranchiseDto> CreateAsync(FranchiseDto request, CancellationToken ct = default)
        {
            // Regla simple: nombre único (case-insensitive)
            var name = (request.Name ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name is required.");

            var exists = await _db.Franchises
                .AsNoTracking()
                .AnyAsync(f => f.Name.ToLower() == name.ToLower(), ct);

            if (exists)
                throw new InvalidOperationException($"A franchise named '{name}' already exists.");

            var entity = new Franchise
            {
                Id = Guid.NewGuid(),
                Name = name,
                Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description!.Trim(),
                OriginCountry = string.IsNullOrWhiteSpace(request.OriginCountry) ? null : request.OriginCountry!.Trim(),
                FoundedOn = request.FoundedOn,
                Founders = string.IsNullOrWhiteSpace(request.Founders) ? null : request.Founders!.Trim(),
                ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl!.Trim()
            };

            _db.Franchises.Add(entity);
            await _db.SaveChangesAsync(ct);

            return new FranchiseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                OriginCountry = entity.OriginCountry,
                FoundedOn = entity.FoundedOn,
                Founders = entity.Founders,
                ImageUrl = entity.ImageUrl
            };
        }

    }
}
