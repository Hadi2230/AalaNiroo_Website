using System;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // CORS
        var origins = (System.Configuration.ConfigurationManager.AppSettings["Cors:Origins"] ?? "*").Split(',').Select(o => o.Trim()).ToArray();
        var cors = new EnableCorsAttribute(string.Join(",", origins), "*", "*");
        config.EnableCors(cors);

        // Routes
        config.MapHttpAttributeRoutes();

        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );

        // JSON default
        config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
    }
}
