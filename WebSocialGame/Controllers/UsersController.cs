using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebSocialGame.Models;

namespace WebSocialGame.Controllers {
    public class UsersController : ApiController {
        private WebSocialGameContext db = new WebSocialGameContext();

        // GET: api/Users
        public IQueryable<User> GetUsers() {
            return db.Users;
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(int id) {
            User user = await db.Users.FindAsync(id);
            if(user == null) {
                return NotFound();
            }

            return Ok(user);
        }

        [ResponseType(typeof(List<User>))]
        [Route("topFive")]
        public async Task<IHttpActionResult> GetTopFive()
        {
            List<User> users = await db.Users.ToListAsync();
            users.Sort(delegate(User user1, User user2)
            {
                return user2.HighestScore.CompareTo(user1.HighestScore);
            });
            int size = users.Count >= 5 ? 5 : users.Count;
            List<User> top = new List<User>(size);
            for (int i = 0; i < size; i++)
            {
                top.Add(users[i]);
            }
            return Ok(top);
        }

        [ResponseType(typeof(User))]
        [Route("getFB/{id}")]
        public async Task<IHttpActionResult> GetFb(long id)
        {
            User user = await db.Users.Where(e => e.FBID == id).SingleOrDefaultAsync();
            if(user == null) {
                return NotFound();
            }

            return Ok(user);
        }

        [ResponseType(typeof(bool))]
        [Route("existsFB/{id}")]
        public async Task<IHttpActionResult> GetExistsFb(long id) {
            return Ok(UserFBExists(id));
        }

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(int id, User user) {
            if(!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            if(id != user.UserID) {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try {
                await db.SaveChangesAsync();
            } catch(DbUpdateConcurrencyException) {
                if(!UserExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(User user) {
            if(!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = user.UserID }, user);
        }

        protected override void Dispose(bool disposing) {
            if(disposing) {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id) {
            return db.Users.Count(e => e.UserID == id) > 0;
        }

        private bool UserFBExists(long id) {
            return db.Users.Count(e => e.FBID == id) > 0;
        }
    }
}