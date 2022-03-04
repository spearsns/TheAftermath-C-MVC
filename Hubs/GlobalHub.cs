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
        
        // -- GAME FUNCTIONS -- //
        // DICE
        public void Roll2D10(string username, string charname, string game)
        {
            Clients.All.NewGameMessage(username, charname, game, "rolls [2D10] ... " + Dice.TwoD10().ToString(), true);
        }
        public void RollD100(string username, string charname, string game)
        {
            Clients.All.NewGameMessage(username, charname, game, "rolls [D100] ... " + Dice.RollD100().ToString(), true);
        }
        public void RandomHit(string username, string charname, string game)
        {
            Clients.All.NewGameMessage(username, charname, game, "rolls [Random Hit] ... " + Dice.RandomHit().ToString(), true);
        }
        public void LikelihoodOfSx(int value, string username, string game)
        {
            int majorSx = (int)Math.Round(value * 0.33, 0);
            int directSx = (int)Math.Round(value * 0.66, 0);
            int fail = 100 - value;
            int minorFail = (int)Math.Round(fail * 0.33, 0);
            int directFail = (int)Math.Round(fail * 0.66, 0);

            string majorSxResult = "[LoS] Major Success: 01 - " + majorSx;
            string directSxResult = "[LoS] Direct Success: " + (majorSx + 1) + " - " + directSx;
            string minorSxResult = "[LoS] Minor Success: " + (directSx + 1) + " - " + value;
            string minorFxResult = "[LoS] Minor Failure: " + (value + 1) + " - " + (value + minorFail);
            string directFxResult = "[LoS] Direct Failure: " + (value + minorFail + 1) + " - " + (value + directFail);
            string majorFxResult = "[LoS] Major Failure: " + (value + directFail + 1) + " - 100";

            Clients.All.NewGameMessage(username, "STORYTELLER", game, majorSxResult, true);
            Clients.All.NewGameMessage(username, "STORYTELLER", game, directSxResult, true);
            Clients.All.NewGameMessage(username, "STORYTELLER", game, minorSxResult, true);
            Clients.All.NewGameMessage(username, "STORYTELLER", game, minorFxResult, true);
            Clients.All.NewGameMessage(username, "STORYTELLER", game, directFxResult, true);
            Clients.All.NewGameMessage(username, "STORYTELLER", game, majorFxResult, true);
        }

        public void SendGameMessage(string username, string charname, string game, string message)
        {
            Clients.All.NewGameMessage(username, charname, game, message, false);
        }

        // -- LOBBY MESSAGING -- //

        public void SendLobbyMessage(string username, string message)
        {
            Clients.All.NewLobbyMessage(username, message);
        }

        // -- IM MESSAGING -- //
        public void SendIM(string sender, string receiver, string message)
        {
            foreach (var connectionId in _connections.GetConnections(receiver))
            {                
                Clients.Client(connectionId).NewIM(sender, message);
            }
        }

        public void Disconnect(string username)
        {
            _connections.Remove(username, Context.ConnectionId);
        }

        // CONNECTION MAPPING -- RELIES ON = ConnectionMapping.cs
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        public override Task OnConnected()
        {
            string username = Context.QueryString["username"];

            _connections.Add(username, Context.ConnectionId);
            Clients.All.NotifyOnline(username, _connections.Count);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var username = Context.QueryString["username"];
            _connections.Remove(username, Context.ConnectionId);
            Clients.All.NotifyOffline(username, _connections.Count);

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