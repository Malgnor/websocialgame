namespace WebSocialGame.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FBIDtoLong : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "FBID", c => c.Long(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "FBID", c => c.Int(nullable: false));
        }
    }
}
