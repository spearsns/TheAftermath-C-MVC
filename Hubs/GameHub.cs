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
    public class GameHub : Hub
    {
        public AftermathV1Entities db = new AftermathV1Entities();
        // DICE
        public void Roll2D10(string username, string charname, string game)
        {
            Clients.All.NewMessage(username, charname, game, "[2D10] " + Dice.TwoD10().ToString(), true);
        }
        public void RollD100(string username, string charname, string game)
        {
            Clients.All.NewMessage(username, charname, game, "[D100] " + Dice.RollD100().ToString(), true);
        }
        public void RandomHit(string username, string charname, string game)
        {
            Clients.All.NewMessage(username, charname, game, "[Random Hit] " + Dice.RandomHit().ToString(), true);
        }
        public void LoS(string username, string game, int value)
        {
            int majorSx = (int)Math.Round(value * 0.33, 0);
            int directSx = (int)Math.Round(value * 0.66, 0);
            int fail = 100 - value;
            int minorFail = (int)Math.Round(fail * 0.33, 0);
            int directFail = (int)Math.Round(fail * 0.66, 0);
            
            string majorSxResult = "[LoS] Major Success: 01 - " + majorSx;
            string directSxResult = "[LoS] Direct Success: " + (majorSx + 1) +" - "+ directSx;
            string minorSxResult = "[LoS] Minor Success: " + (directSx + 1) +" - "+ value;
            string minorFxResult = "[LoS] Minor Failure: " + value + " - " + minorFail;
            string directFxResult = "[LoS] Direct Failure: " + (minorFail + 1) + " - " + directFail;
            string majorFxResult = "[LoS] Major Failure: " + (directFail + 1) + " - 100";

            Clients.All.NewMessage(username, "STORYTELLER", game, majorSxResult, true);
            Clients.All.NewMessage(username, "STORYTELLER", game, directSxResult, true);
            Clients.All.NewMessage(username, "STORYTELLER", game, minorSxResult, true);
            Clients.All.NewMessage(username, "STORYTELLER", game, minorFxResult, true);
            Clients.All.NewMessage(username, "STORYTELLER", game, directFxResult, true);
            Clients.All.NewMessage(username, "STORYTELLER", game, majorFxResult, true);
        }

        // MESSAGING 
        public void Disconnect(string username)
        {
            _connections.Remove(username, Context.ConnectionId);
        }

        public void SendMessage(string username, string charname, string game, string message)
        {
            Clients.All.NewMessage(username, charname, game, message, false);
        }

        public void SendIM(string sender, string receiver, string message)
        {
            foreach (var connectionId in _connections.GetConnections(receiver))
            {
                Clients.Client(connectionId).NewIM(sender, message);
            }
        }

        // CONNECTION MAPPING -- RELIES ON = ConnectionMapping.cs
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        public override Task OnConnected()
        {
            string username = Context.QueryString["username"];

            _connections.Add(username, Context.ConnectionId);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string username = Context.QueryString["username"];

            _connections.Remove(username, Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        // RETURN TO THIS...
        public override Task OnReconnected()
        {
            var username = Context.QueryString["username"];

            if (!_connections.GetConnections(username).Contains(Context.ConnectionId))
            {
                _connections.Add(username, Context.ConnectionId);
            }

            return base.OnReconnected();
        }
    }
}