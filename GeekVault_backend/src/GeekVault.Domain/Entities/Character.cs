namespace GeekVault.Domain.Entities
{
    public class Character
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Alias { get; set; }
        public string? Description { get; set; }

        // Relationships
        public Guid FranchiseId { get; set; }
        public Franchise Franchise { get; set; } = default!;

        // Many-to-many with CharacterType (roles)
        public ICollection<CharacterCharacterType> CharacterCharacterTypes { get; set; } = new List<CharacterCharacterType>();

        // Many-to-many with Team through TeamMembership
        public ICollection<TeamMembership> TeamMemberships { get; set; } = new List<TeamMembership>();

        // Extra data as JSON (powers, weapons, stats, etc.)
        public string? ExtraData { get; set; }
        public string? ImageUrl { get; set; }
    }
}
