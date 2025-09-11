namespace GeekVault.Api.Models
{
    public class CharacterCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public ICollection<Character> Characters { get; set; } = new List<Character>();
    }
}
