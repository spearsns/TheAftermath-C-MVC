using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheAftermath_V2.Classes
{
    public class UserData
    {
        public string Username { get; set; }
        public virtual Guid ID { get; set; }
        public bool Admin { get; set; }
        public bool Play { get; set; }
        public bool Tell { get; set; }
        public virtual Guid CharacterID { get; set; }
        public string CharacterName { get; set; }
        public string CharacterSex { get; set; }
        public virtual Guid CampaignID { get; set; }

    }
}