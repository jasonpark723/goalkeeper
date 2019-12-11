using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FinanceApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;

namespace FinanceApp.Controllers
{
    public class HomeController : Controller
    {
        private int? _uid
        {
            get { return HttpContext.Session.GetInt32("UserId"); }
            set { HttpContext.Session.SetInt32("UserId", (int)value); }
        }
        private FinanceContext dbContext;

        public HomeController(FinanceContext context)
        {
            dbContext = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult LoginPage()
        {
            return View();
        }

        public IActionResult RegisterPage()
        {
            return View();
        }

        public IActionResult CreateUser(User newUser)
        {
            if (ModelState.IsValid)
            {
                if (dbContext.Users.Any(u => u.Email == newUser.Email))
                {
                    ModelState.AddModelError("Email", "Email already in use!");
                    return View("RegisterPage");
                }

                PasswordHasher<User> Hasher = new PasswordHasher<User>();
                newUser.Password = Hasher.HashPassword(newUser, newUser.Password);

                dbContext.Users.Add(newUser);
                dbContext.SaveChanges();

                HttpContext.Session.SetInt32("uid", newUser.UserId);

                return RedirectToAction("Dashboard", "Dashboard");
            }
            return View("RegisterPage");
        }

        public IActionResult LoginUser(LoginUser loginUser)
        {
            if (ModelState.IsValid)
            {
                User foundUser = dbContext.Users.FirstOrDefault(u => u.Email == loginUser.LoginEmail);
                if (foundUser == null)
                {
                    ModelState.AddModelError("LoginEmail", "Invalid Email/Password");
                    return View("LoginPage");
                }

                var hasher = new PasswordHasher<LoginUser>();
                var result = hasher.VerifyHashedPassword(loginUser, foundUser.Password, loginUser.LoginPassword);

                if (result == 0)
                {
                    ModelState.AddModelError("LoginEmail", "Invalid Email/Password");
                    return View("LoginPage");
                }

                _uid = foundUser.UserId;
                return RedirectToAction("Dashboard", "Dashboard");
            }
            return View("LoginPage");
        }

        public IActionResult Logout()
        {
            return RedirectToAction("Index");
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
