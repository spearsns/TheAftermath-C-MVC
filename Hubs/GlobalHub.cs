using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using System.Diagnostics;
using TheAftermath_V2.Models;

namespace TheAftermath_V2.Hubs
{
    public class GlobalHub : Hub
    {
        public AftermathV1Entities db = new AftermathV1Entities();
        
        public void Disconnect(string username)
        {   
            _connections.Remove(username, Context.ConnectionId);
        }

        public void SendMessage(string username, string message)
        {
            Clients.All.NewMessage(username, message);
        }

        public void SendIM(string sender, string receiver, string message)
        {
            foreach (var connectionId in _connections.GetConnections(receiver))
            {                
                Clients.Client(connectionId).NewIM(sender, message);
            }
        }

        // EXAMPLE CONNECTION MAPPING -- RELIES ON = ConnectionMapping.cs
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        public override Task OnConnected()
        {
            var name = Context.QueryString["username"];
            _connections.Add(name, Context.ConnectionId);
            Clients.All.NotifyOnline(name, _connections.Count);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var name = Context.QueryString["username"];
            _connections.Remove(name, Context.ConnectionId);
            Clients.All.NotifyOffline(name, _connections.Count);

            return base.OnDisconnected(stopCalled);
        }
       
        // RETURN TO THIS... 
        public override Task OnReconnected()
        {
            string name = HttpContext.Current.Session["Username"].ToString();

            if (!_connections.GetConnections(name).Contains(Context.ConnectionId))
            {
                _connections.Add(name, Context.ConnectionId);
            }

            return base.OnReconnected();
        }
    }
}