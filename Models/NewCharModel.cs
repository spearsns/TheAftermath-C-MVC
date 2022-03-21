namespace TheAftermath_V2.Models
{
    public class NewCharModel
    {
        public string Strategy { get; set; }
        public string Background { get; set; }
        public string Habitat { get; set; }
        public string History { get; set; }

        // DEMOGRAPHICS
        public string Name { get; set; }
        public string Birthdate { get; set; }
        public string Sex { get; set; }
        public string Ethnicity { get; set; }
        public string HairColor { get; set; }
        public string EyeColor { get; set; }
        public string HairStyle { get; set; }
        public string FacialHair { get; set; }

        // ATTRIBUTES
        public int Memory { get; set; }
        public int Logic { get; set; }
        public int Perception { get; set; }
        public int Willpower { get; set; }
        public int Charisma { get; set; }

        public int Strength { get; set; }
        public int Endurance { get; set; }
        public int Agility { get; set; }
        public int Speed { get; set; }
        public int Beauty { get; set; }

        public int Sequence { get; set; }
        public int Actions { get; set; }

    }
}