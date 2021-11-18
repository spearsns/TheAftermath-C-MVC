using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TheAftermath_V2.Models;

namespace TheAftermath_V2.Classes
{
    public class CharacterData
    {
        public string Name { get; set; }
        public string Status { get; set; }
        public string Birthdate { get; set; }
        public string Sex { get; set; }
        public string Ethnicity { get; set; }
        public string HairColor { get; set; }
        public string HairStyle { get; set; }
        public string FacialHair { get; set; }
        public string EyeColor { get; set; }
        public string Habitat { get; set; }
        public string History { get; set; }
        public string Strategy { get; set; }
        public string Background { get; set; }
        
        // ATTRIBUTES
        public byte Memory { get; set; }
        public byte Logic { get; set; }
        public byte Perception { get; set; }
        public byte Willpower { get; set; }
        public byte Charisma { get; set; }
        public byte Strength { get; set; }
        public byte Endurance { get; set; }
        public byte Agility { get; set; }
        public byte Speed { get; set; }
        public byte Beauty { get; set; }
        // DERIVED ATTRIBUTES
        public byte Sequence { get; set; }
        public byte Actions { get; set; }

        // EXPERIENCE
        public int TotalExp { get; set; }
        public int AvailableExp { get; set; }
        // COMPOSITION (SKILLS CAN ONLY BE USED FOR "STANDARD" SKILLS W HARD-MARKUP)
        public List<SkillData> Skills { get; set; }
        public List<AbilityData> Abilities { get; set; }
        // OTHER
        public List<IDMark> IDMarks { get; set; }
        public string Notes { get; set; }
    }
}