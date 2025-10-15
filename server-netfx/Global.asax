<%@ Application Language="C#" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="System.Web.Http" %>
<%@ Import Namespace="ServerNetFx" %>
<%@ Import Namespace="ServerNetFx.Services" %>
<script runat="server">
    void Application_Start(object sender, EventArgs e)
    {
        GlobalConfiguration.Configure(WebApiConfig.Register);
        ServerNetFx.Seed.Ensure();
    }
</script>
