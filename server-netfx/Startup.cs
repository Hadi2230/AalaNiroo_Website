using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.Owin;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security;
using Microsoft.IdentityModel.Tokens;
using Owin;

[assembly: OwinStartup(typeof(ServerNetFx.Startup))]
namespace ServerNetFx
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            WebApiConfig.Register(config);

            // JWT bearer auth
            var key = System.Configuration.ConfigurationManager.AppSettings["Jwt:Key"];
            var issuer = System.Configuration.ConfigurationManager.AppSettings["Jwt:Issuer"];
            var audience = System.Configuration.ConfigurationManager.AppSettings["Jwt:Audience"];
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                AuthenticationMode = AuthenticationMode.Active,
                AllowedAudiences = new[] { audience },
                IssuerSecurityKeyProviders = new[]
                {
                    new SymmetricKeyIssuerSecurityKeyProvider(issuer, Encoding.UTF8.GetBytes(key))
                }
            });

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);
        }
    }
}
