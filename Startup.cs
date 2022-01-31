using Owin;
using Microsoft.Owin;
[assembly: OwinStartup(typeof(TheAftermath_V2.Startup))]
namespace TheAftermath_V2
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}