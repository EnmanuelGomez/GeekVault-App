namespace GeekVault.Domain.Entities
{
    public class CharacterType // role/archetype: superhero, villain, alien, etc.
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }

        public ICollection<CharacterCharacterType> CharacterCharacterTypes { get; set; } = new List<CharacterCharacterType>();
    }
}
