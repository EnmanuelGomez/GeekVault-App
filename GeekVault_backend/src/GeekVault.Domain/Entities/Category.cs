namespace GeekVault.Domain.Entities
{
    public class Category 
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }

        public ICollection<FranchiseCategory> FranchiseCategories { get; set; } = new List<FranchiseCategory>();
    }
}