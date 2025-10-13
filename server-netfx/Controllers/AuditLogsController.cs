using System.Linq;
using System.Web.Http;
using ServerNetFx.Data;

namespace ServerNetFx.Controllers
{
    [Authorize]
    [RoutePrefix("api/audit-logs")]
    public class AuditLogsController : ApiController
    {
        [HttpGet]
        [Route("")]
        public IHttpActionResult Get(string q = null)
        {
            using (var db = new AppDbContext())
            {
                var list = db.AuditLogs.OrderByDescending(l => l.CreatedAt).Take(1000).ToList();
                if (!string.IsNullOrWhiteSpace(q))
                {
                    var s = q.ToLowerInvariant();
                    list = list.Where(l => (l.Action ?? "").ToLower().Contains(s) || (l.Target ?? "").ToLower().Contains(s)).ToList();
                }
                return Ok(list);
            }
        }
    }
}
