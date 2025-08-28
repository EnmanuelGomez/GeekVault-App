namespace GeekVault.Domain.Entities
{
    public class FranchiseCategory
    {
        public Guid FranchiseId { get; set; }
        public Franchise Franchise { get; set; } = default!;

        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = default!;
    }
}
