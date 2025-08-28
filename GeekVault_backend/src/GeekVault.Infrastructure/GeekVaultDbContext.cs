using GeekVault.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeekVault.Infrastructure
{
    public class GeekVaultDbContext : DbContext
    {
        public GeekVaultDbContext(DbContextOptions<GeekVaultDbContext> options) : base(options) { }

        public DbSet<Character> Characters { get; set; }
        public DbSet<Category> Categories { get; set; }
       // public DbSet<CharacterCategory> CharacterCategories { get; set; }
        public DbSet<Franchise> Franchises { get; set; }
        public DbSet<Team> Teams { get; set; }
        //public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Many-to-Many Character <-> Category
          /*  modelBuilder.Entity<CharacterCategory>()
                .HasKey(cc => new { cc.CharacterId, cc.CategoryId });

            modelBuilder.Entity<CharacterCategory>()
                .HasOne(cc => cc.Character)
                .WithMany(c => c.CharacterCategories)
                .HasForeignKey(cc => cc.CharacterId);

            modelBuilder.Entity<CharacterCategory>()
                .HasOne(cc => cc.Category)
                .WithMany(c => c.CharacterCategories)
                .HasForeignKey(cc => cc.CategoryId);*/

            // JSONB para ExtraData y Preferences
            modelBuilder.Entity<Character>()
                .Property(c => c.ExtraData)
                .HasColumnType("jsonb");

            /*modelBuilder.Entity<User>()
                .Property(u => u.Preferences)
                .HasColumnType("jsonb");*/

            base.OnModelCreating(modelBuilder);
        }
    }
}
