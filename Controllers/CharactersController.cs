using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using TheAftermath_V2.Models;
using System;
using System.Linq.Expressions;
using System.Data.SqlClient;
using System.Data.Common;
using System.Globalization;
using Newtonsoft.Json;
using System.Web.Script.Serialization;

namespace TheAftermath_V2.Controllers
{
    public class CharactersController : Controller
    {
        // GET: Characters
        public AftermathV1Entities db = new AftermathV1Entities();

        /* -- INDEX (CHARACTER SELECT) -- */
        public ActionResult Index()
        {
            /*
            if (Session["Active"] != null) return View();
            else return RedirectToAction("Login", "Home");
            */
             return View();
        }

        [HttpGet]
        public JsonResult GetCharacters()
        {
            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            var charQuery = from c in db.Characters
                              where c.AccountID == acctID
                              select new { c.ID, c.Name, c.Background, c.Status };

            List<Classes.CharacterData> charList = new List<Classes.CharacterData>();
            foreach (var x in charQuery)
            {
                charList.Add(new Classes.CharacterData
                {
                    Name = x.Name,
                    Status = x.Status,
                    Background = db.Backgrounds.Where(a=>a.ID == x.Background).Select(a=>a.Name).FirstOrDefault(),
                    TotalExp = db.CharacterExps.Where(a=>a.CharacterID == x.ID).Select(a=>a.TotalExp).FirstOrDefault(),
                    AvailableExp = db.CharacterExps.Where(a => a.CharacterID == x.ID).Select(a => a.AvailableExp).FirstOrDefault()
                });
            }

            return Json(charList, JsonRequestBehavior.AllowGet);
        }

        /* -- NEW CHARACTER -- */
        public ActionResult NewCharacter()
        {
            /*
            if (Session["Active"] != null) return View();
            else return RedirectToAction("Login", "Home");
            */

            NewCharModel newChar = new NewCharModel
            {
                Strategy = NCBio.Strategy(),
                Birthdate = NCBio.Birthdate(),
                Ethnicity = NCBio.Ethnicity(),
                EyeColor = NCBio.EyeColor(),
                Habitat = NCBio.Habitat(),
                History = NCBio.History(),
                Sex = NCBio.Sex(),

                Memory = Dice.TwoD10(),
                Logic = Dice.TwoD10(),
                Perception = Dice.TwoD10(),
                Willpower = Dice.TwoD10(),
                Charisma = Dice.TwoD10(),

                Strength = Dice.TwoD10(),
                Endurance = Dice.TwoD10(),
                Agility = Dice.TwoD10(),
                Speed = Dice.TwoD10(),
                Beauty = Dice.TwoD10()
            };
            return View(newChar);
        }

        [HttpGet]
        public JsonResult GetStandards()
        {
            var skillsQuery = from i in db.Skills
                              where i.Disabled == false && i.Type == "Standard"
                              select new { i.Name, i.ShortTxt, i.LongTxt, i.Class, i.Type, i.Description, i.Formula, i.Requirements };
                                
            List<Classes.SkillData> skillsList = new List<Classes.SkillData>();
            foreach (var x in skillsQuery)
            {
                skillsList.Add(new Classes.SkillData { Name = x.Name, 
                                                        ShortTxt = x.ShortTxt, 
                                                        LongTxt = x.LongTxt, 
                                                        Class = x.Class, 
                                                        Type = x.Type, 
                                                        Description = x.Description, 
                                                        Formula = x.Formula, 
                                                        Requirements = x.Requirements
                });
            }

            return Json(skillsList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetBackgroundData(string name)
        {
            var bgData = db.Backgrounds.Where(x => x.Name == name && x.Disabled == false).FirstOrDefault();
            return Json(bgData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetBackgroundSkills(string[] skillsArr)
        {
            List<Classes.SkillData> skillsList = new List<Classes.SkillData>();
            foreach (string skill in skillsArr)
            {
                var data = db.Skills.Where(a => a.Name == skill).Single();
                skillsList.Add(new Classes.SkillData
                {
                    Name = data.Name,
                    Type = data.Type,
                    Class = data.Class,
                    ShortTxt = data.ShortTxt,
                    LongTxt = data.LongTxt,
                    Formula = data.Formula
                });
            }

            return Json(skillsList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetSkillData(string name)
        {
            var result = db.Skills.Where(x => x.Name == name && x.Disabled == false).Single();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public JsonResult GetNewSkills(string skillClass)
        {
            var skillsQuery = from i in db.Skills
                              where i.Disabled == false && i.Class == skillClass && i.Type != "Standard" 
                              select new { i.Name, i.ShortTxt, i.LongTxt, i.Class, i.Type, i.Description, i.Formula, i.Requirements };         

            List<Classes.SkillData> skillsList = new List<Classes.SkillData>();
            foreach (var x in skillsQuery)
            {
                skillsList.Add(new Classes.SkillData { Name = x.Name, 
                                                        ShortTxt= x.ShortTxt,
                                                        LongTxt = x.LongTxt,
                                                        Class = x.Class, 
                                                        Type = x.Type, 
                                                        Description = x.Description, 
                                                        Formula = x.Formula, 
                                                        Requirements = x.Requirements 
                });
            }
            return Json(skillsList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult NewCharacter([Bind(Include = "Background, Strategy, History, Habitat, Name, Birthdate, Sex, Ethnicity, HairColor, EyeColor, HairStyle, FacialHair,"+
                                        "Memory, Logic, Perception, Willpower, Charisma, Strength, Endurance, Agility, Speed, Beauty, Sequence, Actions")] Models.NewCharModel input)
        {
            if (ModelState.IsValid)
            {
                var character = new Character
                {
                    ID = Guid.NewGuid(),
                    AccountID = Guid.Parse(Session["UserID"].ToString()),
                    Name = input.Name,
                    Status = "Healthy",
                    Birthdate = input.Birthdate,
                    Sex = input.Sex,
                    Ethnicity = input.Ethnicity,
                    HairColor = input.HairColor,
                    HairStyle = input.HairStyle,
                    FacialHair = input.FacialHair,
                    EyeColor = input.EyeColor,

                    Strategy = input.Strategy,
                    Habitat = input.Habitat,
                    History = db.Histories.Where(x => x.Name == input.History).Select(x=>x.ID).Single(),
                    Background = db.Backgrounds.Where(x => x.Name == input.Background).Select(x => x.ID).Single(),
                    
                    CreateDate = DateTime.Now
                };
                db.Characters.Add(character);
                db.SaveChanges();

                // CHARACTER ATTRIBUTES
                List<CharacterAttribute> charAttrs = new List<CharacterAttribute>
                {
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Memory").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Memory },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Logic").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Logic },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Perception").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Perception },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Charisma").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Charisma },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Willpower").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Willpower },

                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Strength").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Strength },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Endurance").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Endurance },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Agility").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Agility },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Speed").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Speed },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Beauty").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Beauty },

                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Sequence").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Sequence },
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Actions").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Memory }
                };
                foreach (var attr in charAttrs) db.CharacterAttributes.Add(attr);
                db.SaveChanges();

                List<CharacterSkill> charSkills = new List<CharacterSkill>();
                foreach (string key in Request.Form.AllKeys)
                {                    
                    if (key.StartsWith("Skill-")) 
                    {
                        string skillName = key.Substring(6);

                        charSkills.Add(new CharacterSkill {
                            ID = Guid.NewGuid(),
                            CharacterID = character.ID,
                            MasterID = (Guid)db.Skills.Where(x => x.Name == skillName).Select(x => x.ID).First(),
                            Value = Convert.ToInt16(Request.Form[key])
                        });
                    }
                    foreach (var skill in charSkills) db.CharacterSkills.Add(skill);
                }
                db.SaveChanges();
                
                var charExp = new CharacterExp
                {
                    ID = Guid.NewGuid(),
                    CharacterID = character.ID,
                    TotalExp = 0,
                    AvailableExp = 0
                };
                db.CharacterExps.Add(charExp);
                db.SaveChanges();

                var charID = new IDMark
                {
                    ID = Guid.NewGuid(),
                    CharacterID = character.ID
                };
                db.IDMarks.Add(charID);
                db.SaveChanges();

                var charNote = new CharacterNote
                {
                    ID = Guid.NewGuid(),
                    CharacterID = character.ID,
                    CreateDate = DateTime.Now
                };
                db.CharacterNotes.Add(charNote);
                db.SaveChanges();

                ViewBag.ErrorMessage = "Success";
                return RedirectToAction("Success", "Home");
            }
            return View(input);
        }

        /* -- CHARACTER MANAGEMENT -- */
        public ActionResult CharacterManagement()
        {
            /*
            if (Session["Active"] != null) return View();
            else return RedirectToAction("Login", "Home");
            */

            string name = HttpContext.Request.QueryString["name"];

            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            var character = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).First();
            var charAttrs = db.CharacterAttributes.Where(a => a.CharacterID == character.ID).Join(db.Attributes, ca => ca.AttributeID, a => a.ID, (ca, a) => new{ Name = a.Name, Value = ca.Value });

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
                IDMarks = db.IDMarks.Where(a=>a.CharacterID == character.ID).ToList(),
                Notes = db.CharacterNotes.Where(a=>a.CharacterID == character.ID).First().ToString()
            };
            return View(charData);
        }

        [HttpPost]
        public JsonResult GetCurrentSkills(string name)
        {
            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            Guid charID = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).Select(a=>a.ID).Single();
            var skillQuery = from cs in db.CharacterSkills
                             where cs.CharacterID == charID
                             join s in db.Skills on cs.MasterID equals s.ID
                             select new { s.Name, s.ShortTxt, s.LongTxt, s.Class, s.Type, s.Description, cs.Value };

            List<Classes.SkillData> skillList = new List<Classes.SkillData>();
            foreach (var skill in skillQuery) skillList.Add(new Classes.SkillData { Name = skill.Name,
                                                                                    ShortTxt = skill.ShortTxt,
                                                                                    LongTxt = skill.LongTxt,
                                                                                    Class = skill.Class,
                                                                                    Type = skill.Type,
                                                                                    Description = skill.Description, 
                                                                                    Value = skill.Value });
            return Json(skillList, JsonRequestBehavior.AllowGet);
        }
    }
}