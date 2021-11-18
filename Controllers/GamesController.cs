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
        // GET: Games
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
    }
}