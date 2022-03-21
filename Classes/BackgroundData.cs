using System.Collections.Generic;

namespace TheAftermath_V2.Classes
{
    public class BackgroundData
    {
        public string Name { get; set; }
        public string Training { get; set; }
        public List<SkillData> Skills { get; set; }
        public byte Combat { get; set; }
        public byte Construction { get; set; }
        public byte Covert { get; set; }
        public byte Craftsman { get; set; }
        public byte Social { get; set; }
        public byte Science { get; set; }
        public byte Survival { get; set; }
        public byte Technology { get; set; }
        public byte Transportation { get; set; }
    }
}