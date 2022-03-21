namespace TheAftermath_V2
{
    public class NCBio
    {
        public static string Strategy()
        {
            int strategyRoll = Dice.D100();
            if (strategyRoll <= 20) return "Order";
            else if (strategyRoll >= 21 && strategyRoll <= 40) return "Exchange";
            else if (strategyRoll >= 41 && strategyRoll <= 60) return "Independence";
            else return "Anarchy";
        }

        public static string Birthdate()
        {
            int month;
            int day;
            int year = 2012 - (Dice.D10() + Dice.D10() + Dice.D10() + Dice.D10() + 6); // MIN AGE = 18 IN 2020 

            int monthRoll = Dice.D100();
            if (monthRoll <= 8) month = 1;                              // 8 -- 31
            else if (monthRoll >= 9 && monthRoll <= 16) month = 2;      // 8 -- 28   
            else if (monthRoll >= 17 && monthRoll <= 24) month = 3;     // 8 -- 31
            else if (monthRoll >= 25 && monthRoll <= 32) month = 4;     // 8 -- 30
            else if (monthRoll >= 33 && monthRoll <= 40) month = 5;     // 8 -- 31
            else if (monthRoll >= 41 && monthRoll <= 48) month = 6;     // 8 -- 30
            else if (monthRoll >= 49 && monthRoll <= 57) month = 7;     // 9 -- 31
            else if (monthRoll >= 58 && monthRoll <= 66) month = 8;     // 9 -- 31
            else if (monthRoll >= 67 && monthRoll <= 75) month = 9;     // 9 -- 30
            else if (monthRoll >= 76 && monthRoll <= 84) month = 10;    // 9 -- 31
            else if (monthRoll >= 85 && monthRoll <= 92) month = 11;    // 8 -- 30   
            else month = 12;                                            // 8 -- 31

            int dayRoll = Dice.D100() / 3;
            if (month == 2 && dayRoll >= 28)
            {
                month = 3;
                day = dayRoll - 28;
            }
            else if (month == 4 && dayRoll > 30 || month == 6 && dayRoll > 30 || month == 9 && dayRoll > 30 || month == 11 && dayRoll > 30)
            {
                month += 1;
                day = dayRoll - 30;
            }
            else if (dayRoll > 31)
            {
                month += 1;
                day = dayRoll - 31;
            }
            else day = dayRoll;

            if (month == 13) month = 1;
            return month + " / " + day + " / " + year;
        }

        public static string Ethnicity()
        {
            int ethnicityRoll = Dice.D100();
            if (ethnicityRoll <= 58) return "Caucasian";
            else if (ethnicityRoll > 58 && ethnicityRoll <= 62) return "Middle-Eastern";
            else if (ethnicityRoll > 62 && ethnicityRoll <= 80) return "Hispanic";
            else if (ethnicityRoll > 80 && ethnicityRoll <= 86) return "Asian";
            else if (ethnicityRoll > 86 && ethnicityRoll <= 99) return "African-American";
            else return "Native-American";
        }

        public static string EyeColor()
        {
            int eyeRoll = Dice.D100();
            if (eyeRoll <= 12) return "Green";
            else if (eyeRoll >= 13 && eyeRoll <= 44) return "Blue";
            else if (eyeRoll >= 45 && eyeRoll <= 59) return "Hazel";
            else if (eyeRoll >= 60 && eyeRoll <= 75) return "Brown";
            else return "Dark Brown";
        }

        public static string Habitat()
        {
            string lifestyle;
            int habitatRoll = Dice.D100();

            if (habitatRoll <= 31) lifestyle = "Urban";
            else if (habitatRoll >= 32 && habitatRoll <= 80) lifestyle = "Suburban";
            else lifestyle = "Rural";

            string region;
            int regionRoll = Dice.D100();

            if (regionRoll <= 6) region = "New England";
            else if (regionRoll >= 7 && regionRoll <= 18) region = "Mid-Atlantic";
            else if (regionRoll >= 19 && regionRoll <= 22) region = "Appalacia";
            else if (regionRoll >= 23 && regionRoll <= 37) region = "Bible Belt";
            else if (regionRoll >= 38 && regionRoll <= 43) region = "East Miss";
            else if (regionRoll >= 44 && regionRoll <= 47) region = "West Miss";
            else if (regionRoll >= 48 && regionRoll <= 53) region = "Gulf Coast";
            else if (regionRoll >= 54 && regionRoll <= 55) region = "High Desert";
            else if (regionRoll >= 56 && regionRoll <= 63) region = "Great Plains";
            else if (regionRoll >= 64 && regionRoll <= 77) region = "Great Lakes";
            else if (regionRoll >= 78 && regionRoll <= 80) region = "Rockies";
            else if (regionRoll >= 81 && regionRoll <= 93) region = "West Coast";
            else region = "Pacific NW";

            return region + " (" + lifestyle + ")";
        }

        public static string History()
        {
            int historyRoll = Dice.D100();
            string result;
            if (historyRoll <= 13) result = "Production";
            else if (historyRoll >= 14 && historyRoll <= 98) result = "Service";
            else return "Agriculture";

            int workRoll = Dice.D100();
            if (result == "Production")
            {
                if (workRoll <= 31) return "Construction";
                else if (workRoll >= 32 && workRoll <= 96) return "Manufacturing";
                else return "Mining";
            }
            else //(result == "Service")
            {
                if (workRoll <= 1) return "Utilities";
                else if (workRoll >= 2 && workRoll <= 4) return "Information";
                else if (workRoll >= 5 && workRoll <= 8) return "Transportation";
                else if (workRoll >= 9 && workRoll <= 23) return "Healthcare";
                else if (workRoll >= 24 && workRoll <= 40) return "Hospitality";
                else if (workRoll >= 41 && workRoll <= 57) return "Government";
                else if (workRoll >= 58 && workRoll <= 72) return "Business";
                else if (workRoll >= 73 && workRoll <= 85) return "Retail";
                else if (workRoll >= 86 && workRoll <= 92) return "Financial";
                else if (workRoll >= 93 && workRoll <= 97) return "Wholesale";
                else return "Education";
            }
        }
        public static string Sex()
        {
            int sexRoll = Dice.D100();
            if (sexRoll <= 49) return "Male";
            else return "Female";
        }

    }
}