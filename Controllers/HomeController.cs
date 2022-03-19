using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web.Mvc;
using TheAftermath_V2.Models;

namespace TheAftermath_V2.Controllers
{
    public class HomeController : Controller
    {
        public AftermathDBEntities db = new AftermathDBEntities();
        // METHODS
        [HttpPost]
        public JsonResult CheckUsername(string username)
        {
            bool isValid = !db.Accounts.ToList().Exists(p => p.Username.Equals(username, StringComparison.CurrentCultureIgnoreCase));
            return Json(isValid);
        }

        [HttpPost]
        public JsonResult CheckEmail(string email)
        {
            bool isValid = !db.Accounts.ToList().Exists(p => p.Email.Equals(email, StringComparison.CurrentCultureIgnoreCase));
            return Json(isValid);
        }

        // ACTIONS
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login([Bind(Include = "username, password")] Account input)
        {
            if (ModelState.IsValid)
            {
                var result = db.Accounts.Where(x => x.Username.Equals(input.Username) && x.Password.Equals(input.Password)).FirstOrDefault();
                if (result != null)
                {
                    var acctStatus = db.AccountStatus.Where(a => a.AccountID == result.ID).Single();
                    if (acctStatus != null)
                    {
                        if (result != null && acctStatus.Active == false)
                        {
                            Session["Active"] = true;
                            Session["UserID"] = result.ID.ToString();
                            Session["Username"] = result.Username.ToString();

                            return RedirectToAction("Index", "Home", new { username = result.Username.ToString() });
                        }
                        else if (result != null && acctStatus.Active == true)
                        {
                            ViewBag.ErrorMessage = "Username currently ACTIVE - Reset Password or Create New Account - BE SELF-CENTERED, DON'T SHARE!";
                            return View(input);
                        }
                        else
                        {
                            ViewBag.ErrorMessage = "Invalid Username or Password";
                            return View(input);
                        }
                    }
                }
            }
            return View();
        }

        [HttpPost]
        public JsonResult UpdateStatus(string user)
        {
            Guid acctID = db.Accounts.Where(a => a.Username == user).Select(a => a.ID).Single();
            if (db.AccountStatus.Any(a => a.AccountID == acctID))
            {
                var record = db.AccountStatus.Where(a => a.AccountID == acctID).First();

                record.Active = true;
                record.Admin = false;
                record.Play = false;
                record.Tell = false;
                record.CampaignID = null;
                record.CharacterID = null;
                record.Timestamp = DateTime.Now;
                db.SaveChanges();

                return Json("Success", JsonRequestBehavior.AllowGet);
            }
            else
            {
                var newRecord = new AccountStatu
                {
                    ID = Guid.NewGuid(),
                    AccountID = acctID,
                    Active = true,
                    Admin = false,
                    Play = false,
                    Tell = false,
                    CampaignID = null,
                    CharacterID = null,
                    Timestamp = DateTime.Now
                };
                db.AccountStatus.Add(newRecord);
                db.SaveChanges();

                return Json("Success", JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Logout()
        {
            Guid acctID = Guid.Parse(Session["UserID"].ToString());
            var record = db.AccountStatus.Where(a => a.AccountID == acctID).First();

            if (record.Tell == true)
            {
                var campaign = db.Campaigns.Where(a => a.ID == record.CampaignID).Single();
                campaign.TellActive = false;
                campaign.Locked = false;
            }

            record.Active = false;
            record.Admin = false;
            record.Play = false;
            record.Tell = false;
            record.CampaignID = null;
            record.CharacterID = null;
            record.Timestamp = DateTime.Now;

            db.SaveChanges();

            Session.Clear();
            Session.Abandon();

            return RedirectToAction("Index", "Home");
        }
        public ActionResult Registration()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Registration([Bind(Include = "username, password, email")] Account input)
        {
            if (ModelState.IsValid)
            {
                var accountData = new Account
                {
                    ID = Guid.NewGuid(),
                    Username = input.Username,
                    Email = input.Email,
                    Password = input.Password,
                    CreateDate = DateTime.Now
                };

                var newRecord = new AccountStatu
                {
                    ID = Guid.NewGuid(),
                    AccountID = accountData.ID,
                    Active = true,
                    Admin = false,
                    Play = false,
                    Tell = false,
                    CampaignID = null,
                    CharacterID = null,
                    Timestamp = DateTime.Now
                };
                db.AccountStatus.Add(newRecord);
                db.SaveChanges();

                db.Accounts.Add(accountData);
                db.SaveChanges();
                ViewBag.ErrorMessage = "Registration Success";
                return RedirectToAction("Login", "Home");
            }
            return View(input);
        }
        // IMPORTANT -- EVALUATE AT LAUNCH
        // FORGOT AND RESET PASSWORD SHOWS NO BUILD ERRORS BUT DOESN'T FUNCTION LOCALLY EITHER
        public ActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ForgotPassword(string input)
        {
            string resetCode = Guid.NewGuid().ToString();

            var verifyUrl = "/Home/ResetPassword/" + resetCode;

            var link = Request.Url.AbsoluteUri.Replace(Request.Url.PathAndQuery, verifyUrl);
            using (var context = new AftermathDBEntities())
            {
                var result = (from s in context.Accounts where s.Email == input select s).FirstOrDefault();
                if (result != null)
                {
                    result.Password = resetCode;

                    context.Configuration.ValidateOnSaveEnabled = false;
                    context.SaveChanges();

                    var subject = "The Aftermath:2012 - Password Reset Request";
                    var body = "You recently requested to reset your password for your account. Click the link below to reset it. " +
                                " <br/><br/><a href='" + link + "'>" + link + "</a> <br/><br/>";

                    SendEmail(result.Email, body, subject);

                    ViewBag.Message = "Reset password link has been sent to your Registered Email.";
                }
                else
                {
                    ViewBag.Message = "Email not on record";
                    return View();
                }
            }

            return View();
        }

        // IMPORTANT -- CHANGE CREDENTIALS BEFORE LAUNCH !!!
        private void SendEmail(string emailAddress, string body, string subject)
        {
            using (MailMessage mm = new MailMessage("spears.ns@gmail.com", emailAddress))
            {
                mm.Subject = subject;
                mm.Body = body;

                mm.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                NetworkCredential NetworkCred = new NetworkCredential("spears.ns@gmail.com", "C0ll3ct1v3!nt3l@G00gl3");
                smtp.UseDefaultCredentials = true;
                smtp.Credentials = NetworkCred;
                smtp.Port = 587;
                smtp.Send(mm);
            }
        }

        public ActionResult ResetPassword()
        {
            return View();
        }
        public ActionResult ResetPassword(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return HttpNotFound();
            }

            using (var context = new AftermathDBEntities())
            {
                var user = context.Accounts.Where(a => a.Password == id).FirstOrDefault();
                if (user != null)
                {
                    ResetPasswordModel model = new ResetPasswordModel();
                    model.ResetCode = id;
                    return View(model);
                }
                else
                {
                    return HttpNotFound();
                }
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetPassword(ResetPasswordModel model)
        {
            string message = "";
            if (ModelState.IsValid)
            {
                using (var context = new AftermathDBEntities())
                {
                    var result = context.Accounts.Where(a => a.Password == model.ResetCode).FirstOrDefault();
                    if (result != null)
                    {
                        result.Password = model.NewPassword;
                        context.Configuration.ValidateOnSaveEnabled = false;
                        context.SaveChanges();
                        message = "New password updated successfully";
                    }
                }
            }
            else
            {
                message = "Something invalid";
            }
            ViewBag.Message = message;
            return View(model);
        }

        [HttpGet]
        public JsonResult GetActiveList()
        {
            var userQ = from a in db.AccountStatus
                        where a.Active == true
                        join acct in db.Accounts on a.AccountID equals acct.ID
                        select new { acct.Username, acct.ID, a.Play, a.Tell, a.Admin };

            List<Classes.UserData> resultsList = new List<Classes.UserData>();
            foreach (var user in userQ) resultsList.Add(new Classes.UserData { ID = user.ID, Username = user.Username, Admin = user.Admin, Play = user.Play, Tell = user.Tell });
            return Json(resultsList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Playbook()
        {
            return View();
        }
        public ActionResult Backstory()
        {
            return View();
        }
        public ActionResult Help()
        {
            return View();
        }
        public ActionResult Success()
        {
            return View();
        }
    }
}