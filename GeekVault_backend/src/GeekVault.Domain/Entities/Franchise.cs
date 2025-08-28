namespace GeekVault.Domain.Entities
{
    public class Franchise
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string? OriginCountry { get; set; }
        public string? ImageUrl { get; set; }

        public ICollection<Character> Characters { get; set; } = new List<Character>();
        public ICollection<FranchiseCategory> FranchiseCategories { get; set; } = new List<FranchiseCategory>();
    }
}
