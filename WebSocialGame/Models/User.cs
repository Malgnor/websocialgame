using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebSocialGame.Models
{
    public class User
    {
        public int UserID { get; set; }
        public int FBID { get; set; }
        public string Name { get; set; }
        public int HighestDistance { get; set; }
        public int HighestCoins { get; set; }
    }
}