using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheAftermath_V2.Classes
{
    public class SkillData
    {
        public string Name { get; set; }
        public string ShortTxt { get; set; }
        public string LongTxt { get; set; }
        public string Class { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Formula { get; set; }
        public string Requirements { get; set; }
        // CHARACTER RATING
        public int Value { get; set; }
    }

}