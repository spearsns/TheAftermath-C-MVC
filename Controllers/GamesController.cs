using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TheAftermath_V2.Models;

namespace TheAftermath_V2.Controllers
{
    public class GamesController : Controller
    {
        public AftermathDBEntities db = new AftermathDBEntities();

        // -- ADMIN PAGE -- //
        public ActionResult Admin()
        {
            if (Session["Active"] != null)
            {
                Guid acctID = Guid.Parse(Session["UserID"].ToString());
                string gameName = HttpContext.Request.QueryString["game"];
                var game = db.Campaigns.Where(a => a.Name == gameName).First();
                game.Locked = true;
                db.SaveChanges();

                // UPDATE ACCOUNT STATUS
                var record = db.AccountStatus.Where(a => a.AccountID == acctID).First();
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
            else return RedirectToAction("Login", "Home");

        }
        // -- ADMIN SUBMIT -- //
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

        [HttpPost]
        public JsonResult CheckGameName(string gamename)
        {
            bool isValid = !db.Campaigns.ToList().Exists(a => a.Name.Equals(gamename, StringComparison.CurrentCultureIgnoreCase));
            return Json(isValid);
        }

        [HttpPost]
        public JsonResult GetCharacterList(string game)
        {
            Guid gameID = db.Campaigns.Where(a => a.Name == game).Select(a => a.ID).First();

            var characterQ = from ax in db.AccountStatus
                             where ax.CampaignID == gameID
                             join a in db.Accounts on ax.AccountID equals a.ID
                             join c in db.Characters on ax.CharacterID equals c.ID
                             select new { a.Username, ax.CharacterID, c.Name, c.Sex };

            List<Classes.UserData> characterList = new List<Classes.UserData>();
            foreach (var record in characterQ)
            {
                characterList.Add(new Classes.UserData { Username = record.Username, CharacterID = (Guid)record.CharacterID, CharacterName = record.Name, CharacterSex = record.Sex });
            }
            return Json(characterList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCharacterSheet(string name, string user)
        {
            Guid acctID = db.Accounts.Where(a => a.Username == user).Select(a => a.ID).Single();

            var character = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).First();
            var charAttrs = db.CharacterAttributes.Where(a => a.CharacterID == character.ID).Join(db.Attributes, ca => ca.AttributeID, a => a.ID, (ca, a) => new { Name = a.Name, Value = ca.Value });

            var skillQuery = from cs in db.CharacterSkills
                             where cs.CharacterID == character.ID
                             join s in db.Skills on cs.SkillID equals s.ID
                             select new { s.Name, s.Type, s.Class, cs.Value };

            List<Classes.SkillData> skillList = new List<Classes.SkillData>();
            foreach (var skill in skillQuery) skillList.Add(new Classes.SkillData { Name = skill.Name, Type = skill.Type, Class = skill.Class, Value = skill.Value });

            var abilityQuery = from ca in db.CharacterAbilities
                               where ca.CharacterID == character.ID
                               join a in db.Abilities on ca.AbilityID equals a.ID
                               select new { a.Name, a.Description };

            Classes.IDMarks idMarks = new Classes.IDMarks
            {
                EyeColor = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a=>a.EyeColor).SingleOrDefault(),
                HairColor = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a => a.HairColor).SingleOrDefault(),
                HairStyle = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a => a.HairStyle).SingleOrDefault(),
                FacialHair = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a => a.FacialHair).SingleOrDefault()
            };

            List<Classes.AbilityData> abilityList = new List<Classes.AbilityData>();
            foreach (var ability in abilityQuery) abilityList.Add(new Classes.AbilityData { Name = ability.Name, Description = ability.Description });

            Classes.CharacterData charData = new Classes.CharacterData
            {
                // DEMOGRAPHICS
                Name = character.Name,
                Status = character.Status,
                Birthdate = character.Birthdate,
                Sex = character.Sex,
                Ethnicity = character.Ethnicity,
                Habitat = character.Habitat,
                History = db.Histories.Where(a => a.ID == character.History).Select(a => a.Name).First(),
                Strategy = character.Strategy,
                Background = db.Backgrounds.Where(a => a.ID == character.Background).Select(a => a.Name).First(),

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

                Skills = skillList,
                Abilities = abilityList,
                IDMarks = idMarks
            };

            return Json(charData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetExperience(string user, string charname)
        {
            Guid acctID = db.Accounts.Where(a => a.Username == user).Select(a => a.ID).Single();
            Guid charID = db.Characters.Where(a => a.Name == charname && a.AccountID == acctID).Select(a => a.ID).Single();
            int exp = db.CharacterExps.Where(a => a.CharacterID == charID).Select(a => a.AvailableExp).Single();

            return Json(exp, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetGameActiveList(string game)
        {
            Guid gameID = db.Campaigns.Where(a => a.Name == game).Select(a => a.ID).First();

            var activeQ = from ax in db.AccountStatus
                          where ax.CampaignID == gameID
                          join a in db.Accounts on ax.AccountID equals a.ID
                          select new { a.Username, ax.Play, ax.Tell };

            List<Classes.UserData> userList = new List<Classes.UserData>();
            foreach (var record in activeQ)
            {
                userList.Add(new Classes.UserData { Username = record.Username, Play = record.Play, Tell = record.Tell });
            }

            return Json(userList, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetGameLinks(string game)
        {
            var gameRecord = db.Campaigns.Where(a => a.Name == game).Single();
            Campaign result = new Campaign
            {
                ConferenceLink = gameRecord.ConferenceLink,
                MapLoc = gameRecord.MapLoc,
                PictureLoc = gameRecord.PictureLoc
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
                    Population = db.AccountStatus.Where(a => a.CampaignID == x.ID).Count(),
                    TellActive = x.TellActive,
                    Locked = x.Locked
                });
            }

            return Json(gameList, JsonRequestBehavior.AllowGet);
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
                              id.EyeColor,
                              id.HairColor,
                              id.HairStyle,
                              id.FacialHair,
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

        // -- INDEX PAGE -- //
        public ActionResult Index()
        {
            if (Session["Active"] != null) return View();
            else return RedirectToAction("Login", "Home");
        }

        [HttpPost]
        public JsonResult LockGame(string name)
        {
            var game = db.Campaigns.Where(a => a.Name == name).First();
            game.Locked = true;
            db.SaveChanges();

            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        // -- NEW GAME PAGE -- //
        public ActionResult NewGame()
        {
            if (Session["Active"] != null) return View();
            else return RedirectToAction("Login", "Home");
        }
        // -- NEW GAME SUBMIT -- //
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

        // -- PLAY PAGE -- //
        public ActionResult Play()
        {
            if (Session["Active"] != null)
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
                                 join cs in db.CharacterSkills on s.ID equals cs.SkillID
                                 select new { s.Name, s.Description, cs.Value };

                List<Classes.SkillData> skillList = new List<Classes.SkillData>();
                foreach (var skill in skillQuery) skillList.Add(new Classes.SkillData { Name = skill.Name, Description = skill.Description, Value = skill.Value });

                var abilityQuery = from cab in db.CharacterAbilities
                                   where cab.CharacterID == character.ID
                                   join a in db.Abilities on cab.AbilityID equals a.ID
                                   select new { a.Name, a.Effects, a.Description };

                List<Classes.AbilityData> abilityList = new List<Classes.AbilityData>();
                foreach (var ability in abilityQuery) abilityList.Add(new Classes.AbilityData { Name = ability.Name, Description = ability.Description, Effects = ability.Effects });

                Classes.IDMarks idMarks = new Classes.IDMarks
                {
                    EyeColor = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a => a.EyeColor).FirstOrDefault(),
                    HairColor = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a => a.HairColor).FirstOrDefault(),
                    HairStyle = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a => a.HairStyle).FirstOrDefault(),
                    FacialHair = db.IDMarks.Where(a => a.CharacterID == character.ID).Select(a => a.FacialHair).FirstOrDefault()
                };

                Classes.CharacterData charData = new Classes.CharacterData
                {
                    // DEMOGRAPHICS
                    Name = character.Name,
                    Status = character.Status,
                    Birthdate = character.Birthdate,
                    Sex = character.Sex,
                    Ethnicity = character.Ethnicity,
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

                    Skills = skillList,
                    Abilities = abilityList,
                    IDMarks = idMarks
                };
                return View(charData);
            }
            else return RedirectToAction("Login", "Home");
        }

        // -- TELL PAGE -- //
        public ActionResult Tell()
        {
            if (Session["Active"] != null)
            {
                Guid acctID = Guid.Parse(Session["UserID"].ToString());
                string gameName = HttpContext.Request.QueryString["game"];
                Session["GameName"] = gameName;
                var gameRecord = db.Campaigns.Where(a => a.Name == gameName).First();
                gameRecord.TellActive = true;
                db.SaveChanges();

                return View();
            }
            else return RedirectToAction("Login", "Home");
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
        public JsonResult UpdateExperience(string user, string name, int exp)
        {
            Guid acctID = db.Accounts.Where(a => a.Username == user).Select(a => a.ID).Single();
            Guid charID = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).Select(a => a.ID).Single();

            var record = db.CharacterExps.Where(a => a.CharacterID == charID).Single();

            int totalExp = record.TotalExp;
            int availExp = record.AvailableExp;

            record.TotalExp = totalExp + exp;
            record.AvailableExp = availExp + exp;

            db.SaveChanges();
            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateGameMap()
        {
            string game = Request.Form["game"];
            if (Request.Files.Count > 0)
            {
                try
                {
                    string mapLoc = "";
                    var record = db.Campaigns.Where(a => a.Name == game).Single();

                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];
                        string extension = Path.GetExtension(file.FileName);
                        string fname = game + "-Map-" + DateTime.Now.ToString("MMddyyyy-HHmmss") + extension;
                        mapLoc = fname;

                        string filename = Path.Combine(Server.MapPath("~/Uploads/Games/Maps/"), fname);
                        file.SaveAs(filename);
                    }

                    record.MapLoc = mapLoc;
                    db.SaveChanges();
                    return Json("Success!");
                }
                catch (Exception ex)
                {
                    return Json("Failure. Error details: " + ex.Message);
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }

        [HttpPost]
        public ActionResult UpdateGamePic()
        {
            string game = Request.Form["game"];
            if (Request.Files.Count > 0)
            {
                try
                {
                    string picLoc = "";
                    var record = db.Campaigns.Where(a => a.Name == game).Single();

                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];
                        string extension = Path.GetExtension(file.FileName);
                        string fname = game + "-Pic-" + DateTime.Now.ToString("MMddyyyy-HHmmss") + extension;
                        picLoc = fname;

                        string filename = Path.Combine(Server.MapPath("~/Uploads/Games/Pics/"), fname);
                        file.SaveAs(filename);
                    }

                    record.PictureLoc = picLoc;
                    db.SaveChanges();
                    return Json("Success!");
                }
                catch (Exception ex)
                {
                    return Json("Failure. Error details: " + ex.Message);
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }

        [HttpPost]
        public ActionResult UpdateIDMarks(Classes.IDMarks idm)
        {
            string username = idm.UserName;
            string charname = idm.CharacterName;

            Guid acctID = db.Accounts.Where(a => a.Username == username).Select(a => a.ID).Single();
            var charRecord = db.Characters.Where(a => a.Name == charname && a.AccountID == acctID).Single();
            var idMarksRecord = db.IDMarks.Where(a => a.CharacterID == charRecord.ID).Single();

            idMarksRecord.HairStyle = idm.HairStyle;
            idMarksRecord.FacialHair = idm.FacialHair;
            charRecord.Status = idm.Status;

            idMarksRecord.Head = idm.Head;
            idMarksRecord.Face = idm.Face;
            idMarksRecord.Neck = idm.Neck;
            idMarksRecord.LeftShoulder = idm.LeftShoulder;
            idMarksRecord.RightShoulder = idm.RightShoulder;
            idMarksRecord.LeftRibs = idm.LeftRibs;
            idMarksRecord.RightRibs = idm.RightRibs;
            idMarksRecord.LeftBicep = idm.LeftBicep;
            idMarksRecord.RightBicep = idm.RightBicep;
            idMarksRecord.Stomach = idm.Stomach;
            idMarksRecord.LowerBack = idm.LowerBack;
            idMarksRecord.LeftForearm = idm.LeftForearm;
            idMarksRecord.RightForearm = idm.RightForearm;
            idMarksRecord.Groin = idm.Groin;
            idMarksRecord.Rear = idm.Rear;
            idMarksRecord.LeftHand = idm.LeftHand;
            idMarksRecord.RightHand = idm.RightHand;
            idMarksRecord.LeftThigh = idm.LeftThigh;
            idMarksRecord.RightThigh = idm.RightThigh;
            idMarksRecord.LeftCalf = idm.LeftCalf;
            idMarksRecord.RightCalf = idm.RightCalf;
            idMarksRecord.LeftFoot = idm.LeftFoot;
            idMarksRecord.RightFoot = idm.RightFoot;

            db.SaveChanges();
            return Json(charname, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateLink(string game, string input)
        {
            var record = db.Campaigns.Where(a => a.Name == game).Single();
            record.ConferenceLink = input;
            db.SaveChanges();
            return Json("Link Updated Successfully!", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateStatus(string user, string character, string game)
        {
            Guid acctID = db.Accounts.Where(a => a.Username == user).Select(a => a.ID).Single();
            var gameRecord = db.Campaigns.Where(a => a.Name == game).First();
            var statusRecord = db.AccountStatus.Where(a => a.AccountID == acctID).First();

            if (character != "STORYTELLER")
            {
                statusRecord.Active = true;
                statusRecord.Admin = false;
                statusRecord.Play = true;
                statusRecord.Tell = false;
                statusRecord.CampaignID = gameRecord.ID;
                statusRecord.CharacterID = db.Characters.Where(a => a.Name == character && a.AccountID == acctID).Select(a => a.ID).Single();
                statusRecord.Timestamp = DateTime.Now;
            }
            else
            {
                statusRecord.Active = true;
                statusRecord.Admin = false;
                statusRecord.Play = false;
                statusRecord.Tell = true;
                statusRecord.CampaignID = gameRecord.ID;
                statusRecord.CharacterID = null;
                statusRecord.Timestamp = DateTime.Now;

                gameRecord.TellActive = true;
            }
            db.SaveChanges();

            return Json("Success", JsonRequestBehavior.AllowGet);
        }

    }
}