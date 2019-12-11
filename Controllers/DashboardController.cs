using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FinanceApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;
using System.IO;
using System.Net.Http;


namespace FinanceApp.Controllers
{
    public class DashboardController : Controller
    {
        private int? _uid
        {
            get { return HttpContext.Session.GetInt32("UserId"); }
            set { HttpContext.Session.SetInt32("UserId", (int)value); }
        }
        private FinanceContext dbContext;

        static HttpClient client = new HttpClient();

        public DashboardController(FinanceContext context)
        {
            dbContext = context;
        }

        public IActionResult Investment()
        {
            if (_uid == null)
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.allStocks = dbContext.Stocks
                    .Where(s => s.User.UserId == _uid)
                    .ToList();

            return View();
        }

        // public async Task CreateStock(Stock newStock)

        public IActionResult CreateStock(Stock newStock)
        {
            newStock.User = dbContext.Users.FirstOrDefault(u => u.UserId == _uid);
            dbContext.Stocks.Add(newStock);
            dbContext.SaveChanges();
            return RedirectToAction("Investment");
        }


        public IActionResult Retirement()
        {
            if (_uid == null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }


        //navigation
        [HttpGet("Dashboard/Expense")]
        public IActionResult Expense()
        {
            if (_uid == null)
            {
                return RedirectToAction("Index", "Home");
            }

            //total expense history
            List<Transaction> allTransaction = dbContext.Transactions
                                .Include(t => t.Category)
                                .Where(t => t.User.UserId == _uid)
                                .ToList();

            ViewBag.ExpenseHistory = allTransaction
                                .OrderByDescending(t => t.Date);

            //data for chart


            ViewBag.test = allTransaction
                                .Where(t => t.Date.Month == DateTime.Now.Month)
                                .GroupBy(t => new { t.Date.Day, t.Category.Name })

                                .Select(ms => new
                                {
                                    day = ms.First().Date.Day,
                                    category = ms.First().Category.Name,
                                    Total = ms.Sum(c => c.Amount)
                                })
                                .ToList();

            ViewBag.Categories = dbContext.Categories.ToList();

            return View();
        }
        public IActionResult Dashboard()
        {
            // redirect if user not in session
            if (_uid == null)
            {
                return RedirectToAction("Index", "Home");
            }

            //all users transactions included category
            List<Transaction> allTransaction = dbContext.Transactions
                    .Include(t => t.Category)
                    .Where(t => t.User.UserId == _uid)
                    .ToList();

            int day = (int)DateTime.Now.DayOfWeek;
            int thisWeekTotal = allTransaction.Where(t => t.Date >= DateTime.Now.Date.AddDays(-((day + 6) % 7)))
                    .Select(t => t.Amount).ToList()
                    .Sum();

            ViewBag.thisWeekTotal = thisWeekTotal;


            int lastWeekTotal = allTransaction.Where(t => t.Date < DateTime.Now.Date.AddDays(-((day + 6) % 7)) && t.Date >= DateTime.Now.Date.AddDays(-((day + 6) % 7) - 7))
                    .Select(t => t.Amount).ToList()
                    .Sum();
            ViewBag.lastWeekTotal = lastWeekTotal;
            ViewBag.spendingPercent = Math.Round(Math.Abs((double)thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100, 2);
            if (thisWeekTotal > lastWeekTotal)
            {
                ViewBag.MoreSpending = true;
            }
            else
            {
                ViewBag.MoreSpending = false;
            }

            //favorite goal
            ViewBag.FavoriteGoal = dbContext.Goals.FirstOrDefault(g => g.User.UserId == _uid && g.Favorite == true);

            //query all goals
            ViewBag.allGoals = dbContext.Goals
                .Include(g => g.User)
                .Where(g => g.User.UserId == _uid).ToList();

            // all categories
            ViewBag.Categories = dbContext.Categories.ToList();
            //all expense history
            ViewBag.ExpenseHistory = allTransaction
                .OrderByDescending(t => t.Date)
                .Take(5)
                .ToList();

            //monthly expense data
            var MonthlySum = allTransaction
                    .OrderBy(t => t.Date.Month)
                    .GroupBy(t => t.Date.Month)
                    .Select(ms => new
                    {
                        Month = ms.First().Date.Month,
                        Total = ms.Sum(c => c.Amount)
                    }).ToList();

            List<string> barMonth = new List<string>();
            List<int> barTotal = new List<int>();
            foreach (var item in MonthlySum)
            {
                barMonth.Add(CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(item.Month));
                barTotal.Add(item.Total);
            };
            HttpContext.Session.SetObjectAsJson("barMonth", barMonth);
            ViewBag.barMonth = HttpContext.Session.GetString("barMonth");
            HttpContext.Session.SetObjectAsJson("barTotal", barTotal);
            ViewBag.barTotal = HttpContext.Session.GetString("barTotal"); ;


            //donut data
            var CategorySum = allTransaction
                    .Where(t => t.User.UserId == _uid && t.Date.Year == DateTime.Now.Year && t.Date.Month == DateTime.Now.Month)
                    .GroupBy(t => t.Category)
                    .Select(cs => new
                    {
                        CategoryName = cs.First().Category.Name,
                        Total = cs.Sum(c => c.Amount),
                    }).ToList();

            List<string> donutCategory = new List<string>();
            List<int> donutTotal = new List<int>();
            foreach (var item in CategorySum)
            {
                donutCategory.Add(item.CategoryName);
                donutTotal.Add(item.Total);
            }
            HttpContext.Session.SetObjectAsJson("donutCategory", donutCategory);
            ViewBag.donutCategory = HttpContext.Session.GetString("donutCategory");
            HttpContext.Session.SetObjectAsJson("donutTotal", donutTotal);
            ViewBag.donutTotal = HttpContext.Session.GetString("donutTotal"); ;


            //provide gradients of colors
            ViewBag.gradients = new string[] { "danger", "success", "primary", "info", "warning", "secondary" };
            return View("Dashboard");
        }

        public IActionResult CreateGoal(Goal newGoal)
        {
            if (ModelState.IsValid)
            {
                if (newGoal.CurrentAmount >= newGoal.GoalAmount)
                {
                    ModelState.AddModelError("CurrentAmount", "You've already reached the goal!");
                    return View("Dashboard");
                }

                newGoal.User = dbContext.Users.FirstOrDefault(u => u.UserId == _uid);
                if (!dbContext.Goals.Where(g => g.Favorite == true).Any(g => g.User.UserId == _uid))
                {
                    newGoal.Favorite = true;
                }
                dbContext.Goals.Add(newGoal);
                dbContext.SaveChanges();
                return RedirectToAction("Dashboard");

            }
            return View("Dashboard");
        }

        public IActionResult AddAmountGoal(int goalId, int additionalAmount)
        {
            Goal editGoal = dbContext.Goals.FirstOrDefault(g => g.GoalId == goalId);
            editGoal.CurrentAmount += additionalAmount;
            editGoal.UpdatedAt = DateTime.Now;
            dbContext.SaveChanges();
            return RedirectToAction("Dashboard");

        }





        public IActionResult CreateExpense(Transaction newtransaction, int category, string field)
        {
            newtransaction.Category = dbContext.Categories.FirstOrDefault(c => c.CategoryId == category);
            newtransaction.User = dbContext.Users.FirstOrDefault(u => u.UserId == _uid);
            dbContext.Transactions.Add(newtransaction);
            dbContext.SaveChanges();
            if (field == "expense")
            {
                return RedirectToAction("Expense");
            }
            else
            {
                return RedirectToAction("Dashboard");
            }
        }

        [HttpPost("Dashboard/Expense/Delete")]
        public void DeleteExpense(int expense_id)
        {
            Transaction DeleteTransaction = dbContext.Transactions.FirstOrDefault(t => t.TransactionId == expense_id);
            dbContext.Transactions.Remove(DeleteTransaction);
            dbContext.SaveChanges();
        }
    }

    public static class SessionExtensions
    {
        // We can call ".SetObjectAsJson" just like our other session set methods, by passing a key and a value
        public static void SetObjectAsJson(this ISession session, string key, object value)
        {
            // This helper function simply serializes theobject to JSON and stores it as a string in session
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        // generic type T is a stand-in indicating that we need to specify the type on retrieval
        public static T GetObjectFromJson<T>(this ISession session, string key)
        {
            string value = session.GetString(key);
            // Upon retrieval the object is deserialized based on the type we specified
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }


    }
}
