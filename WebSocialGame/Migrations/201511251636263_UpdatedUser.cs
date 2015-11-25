namespace WebSocialGame.Migrations {
    using System.Data.Entity.Migrations;

    public partial class UpdatedUser : DbMigration {
        public override void Up() {
            AddColumn("dbo.Users", "Coins", c => c.Int(nullable: false));
            AddColumn("dbo.Users", "TotalCoins", c => c.Int(nullable: false));
            AddColumn("dbo.Users", "TotalDistance", c => c.Int(nullable: false));
            AddColumn("dbo.Users", "HighestScore", c => c.Int(nullable: false));
        }

        public override void Down() {
            DropColumn("dbo.Users", "HighestScore");
            DropColumn("dbo.Users", "TotalDistance");
            DropColumn("dbo.Users", "TotalCoins");
            DropColumn("dbo.Users", "Coins");
        }
    }
}
