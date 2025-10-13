<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Http" %>
<script runat="server">
    void Application_Start(object sender, EventArgs e)
    {
        GlobalConfiguration.Configure(WebApiConfig.Register);
        ServerNetFx.Seed.Ensure();
    }
</script>
