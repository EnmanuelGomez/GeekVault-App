using GeekVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure
{
    public class GeekVaultDbContext : DbContext
    {
        public GeekVaultDbContext(DbContextOptions<GeekVaultDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Franchise> Franchises { get; set; }
        public DbSet<FranchiseCategory> FranchiseCategories { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<CharacterType> CharacterTypes { get; set; }
        public DbSet<CharacterCharacterType> CharacterCharacterTypes { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamMembership> TeamMemberships { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de tablas intermedias (composite keys)

            modelBuilder.Entity<FranchiseCategory>()
                .HasKey(fc => new { fc.FranchiseId, fc.CategoryId });

            modelBuilder.Entity<CharacterCharacterType>()
                .HasKey(cct => new { cct.CharacterId, cct.CharacterTypeId });

            modelBuilder.Entity<TeamMembership>()
                .HasKey(tm => new { tm.TeamId, tm.CharacterId });
        }
    }
}
