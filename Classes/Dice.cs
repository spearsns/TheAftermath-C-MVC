using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheAftermath_V2
{
    public static class Dice
    {
        public static Random random = new Random();

        public static int D10()
        {
            return random.Next(1, 11);            
        }

        public static int TwoD10()
        {
            return D10() + D10();
        }

        public static int D100()
        {
            return ((D10() - 1) * 10) + D10();
        }
    }
}