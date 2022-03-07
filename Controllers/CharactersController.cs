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
            if (Session["Active"] != null) return View();
            else return RedirectToAction("Login", "Home");
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
                    Background = db.Backgrounds.Where(a => a.ID == x.Background).Select(a => a.Name).FirstOrDefault(),
                    TotalExp = db.CharacterExps.Where(a => a.CharacterID == x.ID).Select(a => a.TotalExp).FirstOrDefault(),
                    AvailableExp = db.CharacterExps.Where(a => a.CharacterID == x.ID).Select(a => a.AvailableExp).FirstOrDefault()
                });
            }

            return Json(charList, JsonRequestBehavior.AllowGet);
        }

        /* -- NEW CHARACTER -- */
        public ActionResult NewCharacter()
        {
            if (Session["Active"] != null) 
            {
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
            else return RedirectToAction("Login", "Home");
            
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
                skillsList.Add(new Classes.SkillData
                {
                    Name = x.Name,
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
        public JsonResult GetBackgroundData(string background)
        {
            var bgData = db.Backgrounds.Where(x => x.Name == background).FirstOrDefault();

            List<Classes.SkillData> skillsList = new List<Classes.SkillData>();
            if (bgData.Skills != null)
            {
                string[] skillsArr;

                if (bgData.Skills.Contains(",")) skillsArr = bgData.Skills.Replace(" ", String.Empty).Split(',');
                else skillsArr = new string[] { bgData.Skills };

                foreach (string skill in skillsArr)
                {
                    Skill result = db.Skills.Where(x => x.Name == skill && x.Disabled == false).Single();
                    skillsList.Add(new Classes.SkillData
                    {
                        Name = result.Name,
                        ShortTxt = result.ShortTxt,
                        LongTxt = result.LongTxt,
                        Class = result.Class,
                        Type = result.Type,
                        Description = result.Description,
                        Formula = result.Formula
                    });
                }
            }

            byte combatSkills = 0;
            byte constructionSkills = 0;
            byte covertSkills = 0;
            byte craftsmanSkills = 0;
            byte socialSkills = 0;
            byte scienceSkills = 0;
            byte survivalSkills = 0;
            byte technologySkills = 0;
            byte transportationSkills = 0;

            if (bgData.Combat != null) combatSkills = (byte)bgData.Combat;
            if (bgData.Construction != null) constructionSkills = (byte)bgData.Construction;
            if (bgData.Covert != null) covertSkills = (byte)bgData.Covert;
            if (bgData.Craftsman != null) craftsmanSkills = (byte)bgData.Craftsman;
            if (bgData.Social != null) socialSkills = (byte)bgData.Social;
            if (bgData.Science != null) scienceSkills = (byte)bgData.Science;
            if (bgData.Survival != null) survivalSkills = (byte)bgData.Survival;
            if (bgData.Technology != null) technologySkills = (byte)bgData.Technology;
            if (bgData.Transportation != null) transportationSkills = (byte)bgData.Transportation;

            Classes.BackgroundData json = new Classes.BackgroundData
            {
                Name = bgData.Name,
                Training = bgData.Training,
                Skills = skillsList,
                Combat = combatSkills,
                Construction = constructionSkills,
                Covert = covertSkills,
                Craftsman = craftsmanSkills,
                Social = socialSkills,
                Science = scienceSkills,
                Survival = survivalSkills,
                Technology = technologySkills,
                Transportation = transportationSkills
            };
            return Json(json, JsonRequestBehavior.AllowGet);
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
                skillsList.Add(new Classes.SkillData
                {
                    Name = x.Name,
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
                    History = db.Histories.Where(x => x.Name == input.History).Select(x => x.ID).Single(),
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
                    new CharacterAttribute { ID = Guid.NewGuid(), CharacterID = character.ID, AttributeID = db.Attributes.Where(x => x.Name == "Actions").Select(x => x.ID).FirstOrDefault(), Value = (byte)input.Actions }
                };
                foreach (var attr in charAttrs) db.CharacterAttributes.Add(attr);
                db.SaveChanges();

                List<CharacterSkill> charSkills = new List<CharacterSkill>();
                foreach (string key in Request.Form.AllKeys)
                {
                    if (key.StartsWith("Skill-"))
                    {
                        string skillName = key.Substring(6);

                        charSkills.Add(new CharacterSkill
                        {
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
                                
                ViewBag.ErrorMessage = "Success";
                return RedirectToAction("Success", "Home");
            }
            return View(input);
        }

        /* -- CHARACTER MANAGEMENT -- */
        public ActionResult CharacterManagement()
        {
            if (Session["Active"] != null)
            {
                string name = HttpContext.Request.QueryString["name"];

                Guid acctID = Guid.Parse(Session["UserID"].ToString());
                var character = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).First();
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
                return View(charData);
            }
            else return RedirectToAction("Login", "Home");
        }

        [HttpPost]
        public JsonResult GetCurrentSkills(string name)
        {
            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            Guid charID = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).Select(a => a.ID).Single();
            var skillQuery = from cs in db.CharacterSkills
                             where cs.CharacterID == charID
                             join s in db.Skills on cs.MasterID equals s.ID
                             select new { s.Name, s.ShortTxt, s.LongTxt, s.Class, s.Type, s.Description, cs.Value };

            List<Classes.SkillData> skillList = new List<Classes.SkillData>();
            foreach (var skill in skillQuery) skillList.Add(new Classes.SkillData
            {
                Name = skill.Name,
                ShortTxt = skill.ShortTxt,
                LongTxt = skill.LongTxt,
                Class = skill.Class,
                Type = skill.Type,
                Description = skill.Description,
                Value = skill.Value
            });
            return Json(skillList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCurrentAbilities(string name)
        {
            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            Guid charID = db.Characters.Where(a => a.Name == name && a.AccountID == acctID).Select(a => a.ID).Single();
            var abilityQ = from ca in db.CharacterAbilities
                             where ca.CharacterID == charID
                             join a in db.Abilities on ca.AbilityID equals a.ID
                             select new { a.Name, a.Description, a.Effects };

            List<Classes.AbilityData> abilityList = new List<Classes.AbilityData>();
            foreach (var ability in abilityQ) abilityList.Add(new Classes.AbilityData
            {
                Name = ability.Name,
                Description = ability.Description,
                Effects = ability.Effects
            });
            return Json(abilityList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetAbilities(string target)
        {
            List<Ability> newAbilityList = new List<Ability>();
            
            if (target == "Other")
            {
                List<string> others = new List<string> { "Other", "Conditioning", "Ensure", "Quickdraw" };

                foreach (string abl in others)
                {
                    var otherAblQuery = from a in db.Abilities
                                        where a.Disabled == false && a.Name.Contains(abl)
                                        select new { a.Name, a.Description, a.Effects, a.Requirements, a.Cost };

                    foreach (var oa in otherAblQuery) newAbilityList.Add(new Ability { 
                                                                            Name = oa.Name,
                                                                            Description = oa.Description,
                                                                            Effects = oa.Effects,
                                                                            Requirements = oa.Requirements,
                                                                            Cost = oa.Cost
                    });
                }
                //var abilities = db.Abilities.Where(x => others.Contains(x.Name));
            }
            else
            {
                var abilityQuery = from a in db.Abilities
                                   where a.Disabled == false && a.Name.Contains(target)
                                   select new { a.Name, a.Description, a.Effects, a.Requirements, a.Cost };

                foreach (var x in abilityQuery)
                {
                    newAbilityList.Add(new Ability
                    {
                        Name = x.Name,
                        Description = x.Description,
                        Effects = x.Effects,
                        Requirements = x.Requirements,
                        Cost = x.Cost
                    });
                }

            }
            return Json(newAbilityList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CharacterManagement([Bind(Include = "Name, Memory, Logic, Perception, Willpower, Charisma, Strength, Endurance, Agility, Speed, Beauty, Sequence, Actions, AvailableExp")] Classes.CharacterData input)
        {
            if (ModelState.IsValid)
            {
                Guid acctID = Guid.Parse(Session["UserID"].ToString());
                string charName = input.Name;
                var charID = db.Characters.Where(x => x.AccountID.Equals(acctID) && x.Name.Equals(charName)).Select(x=>x.ID).First();

                //UPDATE ATTRIBUTES
                var charAttrs = (from ca in db.CharacterAttributes
                                 where ca.CharacterID == charID
                                 join a in db.Attributes on ca.AttributeID equals a.ID
                                 select new { ca.ID, a.Name, ca.AttributeID, ca.Value }).ToList();
                
                foreach (var attr in charAttrs)
                {
                    if (attr.Name == "Memory")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Memory;
                    }
                    else if (attr.Name == "Logic")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Logic;
                    }
                    else if (attr.Name == "Perception")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Perception;
                    }
                    else if (attr.Name == "Willpower")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Willpower;
                    }
                    else if (attr.Name == "Charisma")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Charisma;
                    }
                    else if (attr.Name == "Strength")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Strength;
                    }
                    else if (attr.Name == "Endurance")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Endurance;
                    }
                    else if (attr.Name == "Agility")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Agility;
                    }
                    else if (attr.Name == "Speed")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Speed;
                    }
                    else if (attr.Name == "Sequence")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Sequence;
                    }
                    else if (attr.Name == "Actions")
                    {
                        var result = db.CharacterAttributes.Where(x => x.ID.Equals(attr.ID)).First();
                        result.Value = input.Actions;
                    }
                    db.SaveChanges();
                }

                // UPDATE SKILLS
                // GET EXISTING SKILLS
                var charSkills = (from cs in db.CharacterSkills
                                  where cs.CharacterID == charID
                                  join s in db.Skills on cs.MasterID equals s.ID
                                  select new { cs.ID, s.Name, cs.MasterID, cs.Value }).ToList();

                List<string> skillCheck = new List<string>();
                foreach (var cs in charSkills) skillCheck.Add(cs.Name);
                
                foreach (string key in Request.Form.AllKeys)
                {
                    // SKILL ADJUSTMENTS
                    if (key.StartsWith("Skill-"))
                    {
                        string skillName = key.Substring(6);
                        if (skillCheck.Contains(skillName)) // UPDATE EXISTING SKILL
                        {
                            foreach (var cs in charSkills)
                            {
                                if (cs.Name == skillName)
                                {
                                    var result = db.CharacterSkills.Where(x => x.ID == cs.ID).FirstOrDefault();
                                    result.Value = Convert.ToInt16(Request.Form[key]);
                                }
                            }
                        }
                        else // NEW SKILL
                        {
                            db.CharacterSkills.Add(new CharacterSkill
                            {
                                ID = Guid.NewGuid(),
                                CharacterID = charID,
                                MasterID = (Guid)db.Skills.Where(x => x.Name == skillName).Select(x => x.ID).First(),
                                Value = Convert.ToInt16(Request.Form[key])
                            });
                        }
                    }

                    //ABILITY ADJUSTMENTS
                    else if (key.StartsWith("Ability-"))
                    {
                        string abilityName = Request.Form[key];

                        var charAbilities = (from ca in db.CharacterAbilities
                                             where ca.CharacterID == charID
                                             join a in db.Abilities on ca.AbilityID equals a.ID
                                             select a.Name).ToList();
                        
                        if (charAbilities.Contains(abilityName)) continue;
                        else
                        {
                            db.CharacterAbilities.Add(new CharacterAbility
                            {
                                ID = Guid.NewGuid(),
                                CharacterID = charID,
                                AbilityID = (Guid)db.Abilities.Where(x => x.Name == abilityName).Select(x => x.ID).First()
                            });
                        }
                    }
                }

                var charExp = db.CharacterExps.Where(x => x.CharacterID == charID).First();
                charExp.AvailableExp = input.AvailableExp;
                db.SaveChanges();

                ViewBag.ErrorMessage = "Success";
                return RedirectToAction("Success", "Home");
            }
            return View(input);
        }
    }
}