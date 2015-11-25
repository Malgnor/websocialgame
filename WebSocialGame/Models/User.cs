
namespace WebSocialGame.Models {
    public class User {
        public int UserID { get; set; }
        public long FBID { get; set; }
        public string Name { get; set; }
        public int Coins { get; set; }
        public int TotalCoins { get; set; }
        public int HighestCoins { get; set; }
        public int HighestDistance { get; set; }
        public int TotalDistance { get; set; }
        public int HighestScore { get; set; }
    }
}