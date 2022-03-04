using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using TheAftermath_V2.Models;
using WebMatrix.WebData;

namespace TheAftermath_V2.Controllers
{
    public class GamesController : Controller
    {
        public AftermathV1Entities db = new AftermathV1Entities();

        // -- NAVIGATION -- //
        public ActionResult Index()
        {
            /*
            if (Session["Active"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
            */
            return View();
        }

        [HttpGet]
        public JsonResult GetGames()
        {
            var gameQuery = from c in db.Campaigns
                            where c.Closed == false
                            select new { c.ID, c.Name, c.TellActive, c.Locked };

            List<Classes.GameData> gameList = new List<Classes.GameData>();
            foreach (var x in gameQuery)
            {
                gameList.Add(new Classes.GameData
                {
                    ID = x.ID,
                    Name = x.Name,
                    Population = db.AccountStatus1.Where(a => a.CampaignID == x.ID).Count(),
                    TellActive = x.TellActive,
                    Locked = x.Locked
                });
            }

            return Json(gameList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetGameData(string name)
        {
            var gameQ = (from c in db.Campaigns
                         where c.Name == name && c.Closed == false
                         select new { c.Season, c.Year, c.Description }).Single();

            Classes.GameData result = new Classes.GameData
            {
                Season = gameQ.Season,
                Year = gameQ.Year,
                Description = gameQ.Description
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetGamePW(Guid ID)
        {
            var gameQ = (from c in db.Campaigns
                         where c.ID == ID && c.Closed == false
                         select new { c.PlayerPassword, c.AdminPassword }).Single();

            Classes.GameData result = new Classes.GameData
            {
                PlayerPassword = gameQ.PlayerPassword,
                AdminPassword = gameQ.AdminPassword
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // -- NEW GAME -- //
        public ActionResult NewGame()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult NewGame([Bind(Include = "Name, Season, Year, Description, PlayerPW, AdminPW")] Models.NewGameModel input)
        {
            if (ModelState.IsValid)
            {
                var game = new Campaign
                {
                    ID = Guid.NewGuid(),
                    Name = input.Name,
                    Season = input.Season,
                    Year = input.Year,
                    Description = input.Description,
                    PlayerPassword = input.PlayerPassword,
                    AdminPassword = input.AdminPassword,
                    Locked = false,
                    Closed = false
                };
                db.Campaigns.Add(game);
                db.SaveChanges();

                ViewBag.ErrorMessage = "Success";
                return RedirectToAction("Success", "Home");
            }
            return View(input);
        }

        // -- PLAY (All Character Data can be pulled by STORYTELLER from TELL PAGE)-- //
        public ActionResult Play()
        {
            string charName = HttpContext.Request.QueryString["char"];
            string gameName = HttpContext.Request.QueryString["game"];
            Session["GameName"] = gameName;

            Guid gameID = db.Campaigns.Where(a => a.Name == gameName).Select(a => a.ID).SingleOrDefault();
            Guid acctID = Guid.Parse(Session["UserID"].ToString());

            var character = db.Characters.Where(a => a.Name == charName && a.AccountID == acctID).First();
            var charAttrs = db.CharacterAttributes.Where(a => a.CharacterID == character.ID).Join(db.Attributes, ca => ca.AttributeID, a => a.ID, (ca, a) => new { Name = a.Name, Value = ca.Value });

            var skillQuery = from s in db.Skills
                             where s.Type == "Standard" && s.Disabled == false
                             join cs in db.CharacterSkills on s.ID equals cs.MasterID
                             select new { s.Name, s.Description, cs.Value };

            List<Classes.SkillData> skillList = new List<Classes.SkillData>();
            foreach (var skill in skillQuery) skillList.Add(new Classes.SkillData { Name = skill.Name, Description = skill.Description, Value = skill.Value });

            var abilityQuery = from cab in db.CharacterAbilities
                               where cab.CharacterID == character.ID
                               join a in db.Abilities on cab.AbilityID equals a.ID
                               select new { a.Name, a.Effects, a.Description };

            List<Classes.AbilityData> abilityList = new List<Classes.AbilityData>();
            foreach (var ability in abilityQuery) abilityList.Add(new Classes.AbilityData { Name = ability.Name, Description = ability.Description, Effects = ability.Effects });

            Classes.CharacterData charData = new Classes.CharacterData
            {
                // DEMOGRAPHICS
                Name = character.Name,
                Status = character.Status,
                Birthdate = character.Birthdate,
                Sex = character.Sex,
                Ethnicity = character.Ethnicity,
                HairColor = character.HairColor,
                HairStyle = character.HairStyle,
                FacialHair = character.FacialHair,
                EyeColor = character.EyeColor,
                Habitat = character.Habitat,
                History = db.Histories.Where(a => a.ID == character.History).Select(a => a.Name).First(),
                Strategy = character.Strategy,
                Background = db.Backgrounds.Where(a => a.ID == character.Background).Select(a => a.Name).First(),
                // EXPERIENCE
                TotalExp = db.CharacterExps.Where(a => a.CharacterID == character.ID).Select(a => a.TotalExp).First(),
                AvailableExp = db.CharacterExps.Where(a => a.CharacterID == character.ID).Select(a => a.AvailableExp).First(),
                // ATTRIBUTES
                Memory = charAttrs.Where(a => a.Name == "Memory").Select(a => a.Value).First(),
                Logic = charAttrs.Where(a => a.Name == "Logic").Select(a => a.Value).First(),
                Perception = charAttrs.Where(a => a.Name == "Perception").Select(a => a.Value).First(),
                Willpower = charAttrs.Where(a => a.Name == "Willpower").Select(a => a.Value).First(),
                Charisma = charAttrs.Where(a => a.Name == "Charisma").Select(a => a.Value).First(),

                Strength = charAttrs.Where(a => a.Name == "Strength").Select(a => a.Value).First(),
                Endurance = charAttrs.Where(a => a.Name == "Endurance").Select(a => a.Value).First(),
                Agility = charAttrs.Where(a => a.Name == "Agility").Select(a => a.Value).First(),
                Speed = charAttrs.Where(a => a.Name == "Speed").Select(a => a.Value).First(),
                Beauty = charAttrs.Where(a => a.Name == "Beauty").Select(a => a.Value).First(),

                Sequence = charAttrs.Where(a => a.Name == "Sequence").Select(a => a.Value).First(),
                Actions = charAttrs.Where(a => a.Name == "Actions").Select(a => a.Value).First(),

                Skills = skillList,
                Abilities = abilityList,
                IDMarks = db.IDMarks.Where(a => a.CharacterID == character.ID).ToList()
            };

            // UPDATE ACCOUNT STATUS
            var record = db.AccountStatus1.Where(a => a.AccountID == acctID).First();
            record.Active = true;
            record.Admin = false;
            record.Play = true;
            record.CampaignID = gameID;
            record.CharacterID = character.ID;
            record.Timestamp = DateTime.Now;
            db.SaveChanges();

            return View(charData);
        }

        [HttpPost]
        public JsonResult GetGameActiveList(string game)
        {
            Guid gameID = db.Campaigns.Where(a => a.Name == game).Select(a => a.ID).First();

            var activeQ = from ax in db.AccountStatus1
                          where ax.CampaignID == gameID
                          join a in db.Accounts on ax.AccountID equals a.ID
                          join c in db.Characters on ax.CharacterID equals c.ID
                          select new { a.Username, ax.Play, ax.Tell, c.Name };

            List<Classes.UserData> userList = new List<Classes.UserData>();
            foreach (var record in activeQ)
            {
                userList.Add(new Classes.UserData { Username = record.Username, Play = record.Play, Tell = record.Tell });
            }

            return Json(userList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetIDMarks(string name, string user)
        {
            Guid acctID = db.Accounts.Where(a => a.Username == user).Select(a => a.ID).Single();
            Guid charID = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).Select(a => a.ID).Single();

            var marksQ = (from id in db.IDMarks
                          where id.CharacterID.Equals(charID)
                          join c in db.Characters on id.CharacterID equals c.ID
                          select new
                          {
                              c.Sex,
                              c.Status,
                              c.HairStyle,
                              c.FacialHair,
                              id.Head,
                              id.Face,
                              id.Neck,
                              id.LeftShoulder,
                              id.RightShoulder,
                              id.LeftBicep,
                              id.RightBicep,
                              id.LeftRibs,
                              id.RightRibs,
                              id.Stomach,
                              id.LowerBack,
                              id.Groin,
                              id.Rear,
                              id.LeftForearm,
                              id.RightForearm,
                              id.LeftHand,
                              id.RightHand,
                              id.LeftThigh,
                              id.RightThigh,
                              id.LeftCalf,
                              id.RightCalf,
                              id.LeftFoot,
                              id.RightFoot
                          }).Single();

            Classes.IDMarks result = new Classes.IDMarks
            {
                Sex = marksQ.Sex,
                Status = marksQ.Status,
                HairStyle = marksQ.HairStyle,
                FacialHair = marksQ.FacialHair,
                Head = marksQ.Head,
                Face = marksQ.Face,
                Neck = marksQ.Neck,
                LeftShoulder = marksQ.LeftShoulder,
                RightShoulder = marksQ.RightShoulder,
                LeftBicep = marksQ.LeftBicep,
                RightBicep = marksQ.RightBicep,
                LeftRibs = marksQ.LeftRibs,
                RightRibs = marksQ.RightRibs,
                Stomach = marksQ.Stomach,
                LowerBack = marksQ.LowerBack,
                Groin = marksQ.Groin,
                Rear = marksQ.Rear,
                LeftForearm = marksQ.LeftForearm,
                RightForearm = marksQ.RightForearm,
                LeftHand = marksQ.LeftHand,
                RightHand = marksQ.RightHand,
                LeftThigh = marksQ.LeftThigh,
                RightThigh = marksQ.RightThigh,
                LeftCalf = marksQ.LeftCalf,
                RightCalf = marksQ.RightCalf,
                LeftFoot = marksQ.LeftFoot,
                RightFoot = marksQ.RightFoot
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // -- TELL -- //
        public ActionResult Tell()
        {
            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            string gameName = HttpContext.Request.QueryString["game"];
            Session["GameName"] = gameName;
            var gameRecord = db.Campaigns.Where(a => a.Name == gameName).First();
            gameRecord.TellActive = true;
            db.SaveChanges();

            // UPDATE ACCOUNT STATUS
            var record = db.AccountStatus1.Where(a => a.AccountID == acctID).First();
            record.Active = true;
            record.Admin = false;
            record.Play = false;
            record.Tell = true;
            record.CampaignID = gameRecord.ID;
            record.CharacterID = null;
            record.Timestamp = DateTime.Now;
            db.SaveChanges();

            return View();
        }

        [HttpPost]
        public JsonResult LockGame(string name)
        {
            var game = db.Campaigns.Where(a => a.Name == name).First();
            game.Locked = true;
            db.SaveChanges();

            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UnlockGame(string name)
        {
            var game = db.Campaigns.Where(a => a.Name == name).First();
            game.Locked = false;
            db.SaveChanges();

            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateDate(string name, string season, string year)
        {
            var game = db.Campaigns.Where(a => a.Name == name).First();
            game.Season = season;
            game.Year = year;
            db.SaveChanges();

            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateDescription(string name, string input)
        {
            var game = db.Campaigns.Where(a => a.Name == name).First();
            game.Description = input;
            db.SaveChanges();

            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCharacterList(string game)
        {
            Guid gameID = db.Campaigns.Where(a => a.Name == game).Select(a => a.ID).First();

            var characterQ = from ax in db.AccountStatus1
                             where ax.CampaignID == gameID
                             join a in db.Accounts on ax.AccountID equals a.ID
                             join c in db.Characters on ax.CharacterID equals c.ID
                             select new { a.Username, ax.CharacterID, c.Name };

            List<Classes.UserData> characterList = new List<Classes.UserData>();
            foreach (var record in characterQ)
            {
                characterList.Add(new Classes.UserData { Username = record.Username , CharacterID = (Guid)record.CharacterID , CharacterName = record.Name });
            }
            return Json(characterList, JsonRequestBehavior.AllowGet);
        }

        // -- ADMIN -- //
        public ActionResult Admin()
        {
            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            string gameName = HttpContext.Request.QueryString["game"];
            var game = db.Campaigns.Where(a => a.Name == gameName).First();
            game.Locked = true;
            db.SaveChanges();

            // UPDATE ACCOUNT STATUS
            var record = db.AccountStatus1.Where(a => a.AccountID == acctID).First();
            record.Active = true;
            record.Admin = true;
            record.Play = false;
            record.Tell = false;
            record.CampaignID = game.ID;
            record.CharacterID = null;
            record.Timestamp = DateTime.Now;
            db.SaveChanges();

            // GET CURRENT VALUES
            var gameData = new Classes.GameData
            {
                Name = game.Name,
                Season = game.Season,
                Year = game.Year,
                Description = game.Description,
                PlayerPassword = game.PlayerPassword,
                AdminPassword = game.AdminPassword
            };

            return View(gameData);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Admin([Bind(Include = "Name, Season, Year, Description, PlayerPW, AdminPW")] Classes.GameData input)
        {
            if (ModelState.IsValid)
            {
                string gameName = HttpContext.Request.QueryString["game"];
                var game = db.Campaigns.Where(a => a.Name == gameName).FirstOrDefault();
                game.Name = input.Name;
                game.Season = input.Season;
                game.Year = input.Year;
                game.Description = input.Description;
                game.PlayerPassword = input.PlayerPassword;
                game.AdminPassword = input.AdminPassword;
                db.SaveChanges();

                ViewBag.ErrorMessage = "Success";
                return RedirectToAction("Success", "Home");
            }
            else
            {
                return View(input);
            }
        }
    }
}