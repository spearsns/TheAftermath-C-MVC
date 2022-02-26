using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace TheAftermath_V2.Hubs
{
    public class GameHub : Hub
    {
        // IN GAME PLAY AND TELL
        // CHANGE Clients.All to Clients.Room ?!?
        public void SendMessage(string username, string message)
        {
            Clients.All.NewMessage(username, message);
        }
        public void Roll2D10(string username)
        {
            Clients.All.NewMessage(username, Dice.TwoD10().ToString());
        }
        public void RollD100(string username)
        {
            Clients.All.NewMessage(username, Dice.RollD100());
        }
        public void RandomHit(string username)
        {
            Clients.All.NewMessage(username, Dice.RandomHit());
        }
        public void LoS(string username, int value)
        {
            int majorSx = (int)Math.Round(value * 0.33, 0);
            int directSx = (int)Math.Round(value * 0.66, 0);
            int fail = 100 - value;
            int minorFail = (int)Math.Round(fail * 0.33, 0);
            int directFail = (int)Math.Round(fail * 0.66, 0);
            
            string majorSxResult = "Major Success: 01 - "+ majorSx;
            string directSxResult = "Direct Success: "+ (majorSx + 1) +" - "+ directSx;
            string minorSxResult = "Minor Success: "+ (directSx + 1) +" - "+ value;
            string minorFxResult = "Minor Failure: " + value + " - " + minorFail;
            string directFxResult = "Direct Failure: " + (minorFail + 1) + " - " + directFail;
            string majorFxResult = "Major Failure: " + (directFail + 1) + " - 100";
            
            Clients.All.NewMessage(username, majorSxResult);
            Clients.All.NewMessage(username, directSxResult);
            Clients.All.NewMessage(username, minorSxResult);
            Clients.All.NewMessage(username, minorFxResult);
            Clients.All.NewMessage(username, directFxResult);
            Clients.All.NewMessage(username, majorFxResult);
        }
    }
}