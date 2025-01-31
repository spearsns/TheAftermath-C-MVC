﻿using Microsoft.AspNet.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;
using TheAftermath_V2.Models;

namespace TheAftermath_V2.Hubs
{
    public class GlobalHub : Hub
    {
        public AftermathDBEntities db = new AftermathDBEntities();

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

        public void SendExpGain(string name, int exp)
        {
            Clients.All.NotifyExpGain(name, exp);
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

        // -- GAME MAP / PIC / CONFERENCE LINK UPDATE
        public void SendGameUpdate(string game, string target)
        {
            Clients.All.NotifyGameUpdate(game, target);
        }

        // BOOT USER
        public void SendBootUser(string game, string name)
        {
            Clients.All.NotifyBoot(game, name);
        }

        // TOGGLE GAME LOCK
        public void ToggleLock()
        {
            Clients.All.NotifyLock();
        }

        // CONNECTION MAPPING -- RELIES ON = ConnectionMapping.cs
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();
        
        public override Task OnConnected()
        {
            string username = Context.QueryString["username"];
            string location = Context.QueryString["location"];

            _connections.Add(username, Context.ConnectionId);
            Clients.All.NotifyOnline(username, location);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var username = Context.QueryString["username"];
            var location = Context.QueryString["location"];

            Guid acctID = db.Accounts.Where(a => a.Username == username).Select(a => a.ID).First();
            var record = db.AccountStatus.Where(a => a.AccountID == acctID).First();

            if (record.Tell == true || record.Admin == true)
            {
                var campaign = db.Campaigns.Where(a => a.ID == record.CampaignID).Single();
                campaign.TellActive = false;
                campaign.Locked = false;
            }
            
            record.Active = false;
            record.Admin = false;
            record.Play = false;
            record.Tell = false;
            record.CampaignID = null;
            record.CharacterID = null;
            record.Timestamp = DateTime.Now;

            db.SaveChanges();
            _connections.Remove(username, Context.ConnectionId);
            Clients.All.NotifyOffline(username, location);

            return base.OnDisconnected(stopCalled);
        }

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