namespace GeekVault.Domain.Entities
{
    public class CharacterCharacterType
    {
        public Guid CharacterId { get; set; }
        public Character Character { get; set; } = default!;

        public Guid CharacterTypeId { get; set; }
        public CharacterType CharacterType { get; set; } = default!;
    }
}
