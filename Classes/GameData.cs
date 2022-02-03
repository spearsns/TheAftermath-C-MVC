using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheAftermath_V2.Classes
{
    public class GameData
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Season { get; set; }
        public string Year { get; set; }
        public string Description { get; set; }
        public int Population { get; set; }
        public string PlayerPassword { get; set; }
        public string AdminPassword { get; set; }
        public bool TellActive { get; set; }
        public bool Locked { get; set; }

    }
}