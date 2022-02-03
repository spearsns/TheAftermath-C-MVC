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

        public static string RollD100()
        {
            var tens = (D10() - 1);
            var ones = D10();

            if (tens == ones) return "CRITICAL! " + tens + ones;
            else return tens.ToString() + ones.ToString();
        }

        public static string RandomHit()
        {
            var roll = D100();

            if (roll <= 3) return "Neck";
            else if (roll >= 4 && roll <= 7) return "Face | Head";
            else if (roll >= 8 && roll <= 15) return "Head";
            else if (roll >= 16 && roll <= 20) return "Groin [Major Arteries] | Rear";
            else if (roll >= 21 && roll <= 30) return "Stomach [Organs] | Lower Back [Organs]";
            else if (roll == 31) return "Left Ribs [Heart]";
            else if (roll >= 32 && roll <= 35) return "Left Ribs [Lungs]";
            else if (roll >= 36 && roll <= 40) return "Right Ribs [Lungs]";
            else if (roll >= 41 && roll <= 42) return "Left Shoulder [Inner : Major Arteries]";
            else if (roll >= 43 && roll <= 45) return "Left Shoulder [Outer]";
            else if (roll >= 46 && roll <= 47) return "Right Shoulder [Inner : Major Arteries]";
            else if (roll >= 48 && roll <= 50) return "Right Shoulder [Outer]";
            else if (roll >= 51 && roll <= 52) return "Left Thigh [Inner : Major Arteries]";
            else if (roll == 53) return "Left Thigh [Bone]";
            else if (roll >= 54 && roll <= 55) return "Left Thigh [Outer]";
            else if (roll >= 56 && roll <= 57) return "Right Thigh [Inner : Major Arteries]";
            else if (roll == 58) return "Right Thigh [Bone]";
            else if (roll >= 59 && roll <= 60) return "Right Thigh [Outer]";
            else if (roll >= 61 && roll <= 62) return "Left Bicep [Inner]";
            else if (roll == 63) return "Left Bicep [Bone]";
            else if (roll >= 64 && roll <= 65) return "Left Bicep [Outer]";
            else if (roll >= 66 && roll <= 67) return "Right Bicep [Inner]";
            else if (roll == 68) return "Right Bicep [Bone]";
            else if (roll >= 69 && roll <= 70) return "Right Bicep [Outer]";
            else if (roll >= 71 && roll <= 75) return "Left Forearm";
            else if (roll >= 76 && roll <= 80) return "Right Forearm";
            else if (roll >= 81 && roll <= 86) return "Left Shin [Bone] | Left Calf";
            else if (roll >= 87 && roll <= 92) return "Right Shin [Bone] | Right Calf";
            else if (roll >= 93 && roll <= 94) return "Left Hand";
            else if (roll >= 95 && roll <= 96) return "Right Hand";
            else if (roll >= 97 && roll <= 98) return "Left Foot";
            else return "Right Foot"; // (roll >= 99 && roll <= 100)
        }
    }
}