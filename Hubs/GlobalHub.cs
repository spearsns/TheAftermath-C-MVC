using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace TheAftermath_V2.Hubs
{
    public class GlobalHub : Hub
    {
        public void SendMessage(string username, string message)
        {
            Clients.All.NewMessage(username, message);
        }
        public void SendWhisper(string username, string message)
        {
            Clients.All.NewMessage(username, message);
        }
    }
}