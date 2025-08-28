namespace GeekVault.Api.Models
{
    public class Character
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; }
        public int CharacterCategoryId { get; set; }
        public CharacterCategory CharacterCategory { get; set; } = null!;
        public int FranchiseId { get; set; }
        public Franchise Franchise { get; set; } = null!;
        public string Extras { get; set; } // JSONB en DB
    }
}
