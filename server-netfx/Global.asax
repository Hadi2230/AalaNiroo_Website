<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Http" %>
<%@ Import Namespace="AalaNiroo.Api" %>
<%@ Import Namespace="AalaNiroo.Api.Services" %>
<script runat="server">
    void Application_Start(object sender, EventArgs e)
    {
        GlobalConfiguration.Configure(WebApiConfig.Register);
        AalaNiroo.Api.Seed.Ensure();
    }
</script>
