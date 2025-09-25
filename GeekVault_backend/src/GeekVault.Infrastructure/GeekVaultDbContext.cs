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

            // Franchise
            modelBuilder.Entity<Franchise>()
                .Property(f => f.Name)
                .HasMaxLength(200)
                .IsRequired();

            modelBuilder.Entity<Franchise>(b =>
            {
                b.Property(f => f.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                // NUEVO: mapear DATE y tamaño de Founders
                b.Property(f => f.FoundedOn)
                    .HasColumnType("date"); // PostgreSQL DATE

                b.Property(f => f.Founders)
                    .HasMaxLength(300);     // ajusta si necesitas más
            });

            modelBuilder.Entity<Category>(b =>
            {
                b.Property(c => c.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                b.Property(c => c.Description)
                    .HasMaxLength(500);

                b.HasIndex(c => c.Name)
                    .IsUnique(); // Unicidad por nombre
            });

            // Tabla puente FranchiseCategory (M:N)
            modelBuilder.Entity<FranchiseCategory>()
                .HasKey(fc => new { fc.FranchiseId, fc.CategoryId });

            modelBuilder.Entity<FranchiseCategory>()
                .HasOne(fc => fc.Franchise)
                .WithMany(f => f.FranchiseCategories)
                .HasForeignKey(fc => fc.FranchiseId);

            modelBuilder.Entity<FranchiseCategory>()
                .HasOne(fc => fc.Category)
                .WithMany(c => c.FranchiseCategories)
                .HasForeignKey(fc => fc.CategoryId);

            // Character: mapea jsonb
            modelBuilder.Entity<Character>(b =>
            {
                b.Property(c => c.ExtraData)
                 .HasColumnType("jsonb"); // PostgreSQL jsonb
            });

            // CharacterCharacterType (M:N)
            modelBuilder.Entity<CharacterCharacterType>()
                .HasKey(cct => new { cct.CharacterId, cct.CharacterTypeId });

            // TeamMembership (M:N)
            modelBuilder.Entity<TeamMembership>()
                .HasKey(tm => new { tm.TeamId, tm.CharacterId });

            // TeamMembership (M:N) - relaciones explícitas
            modelBuilder.Entity<TeamMembership>(b =>
            {
                b.HasKey(tm => new { tm.TeamId, tm.CharacterId });

                b.HasOne(tm => tm.Team)
                    .WithMany(t => t.Memberships)
                    .HasForeignKey(tm => tm.TeamId);

                b.HasOne(tm => tm.Character)
                    .WithMany(c => c.TeamMemberships) 
                    .HasForeignKey(tm => tm.CharacterId);

                // Mapea DateOnly a DATE
                b.Property(tm => tm.JoinDate).HasColumnType("date");
                b.Property(tm => tm.LeaveDate).HasColumnType("date");
            });
        }

    }
}
