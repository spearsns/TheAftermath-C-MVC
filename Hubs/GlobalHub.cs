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

        public void SendMessage(string username, string message)
        {
            Clients.All.NewMessage(username, message);
        }

        public void SendIM(string receiver, string message)
        {
            string sender = HttpContext.Current.Session["Username"].ToString();

            foreach (var connectionId in _connections.GetConnections(receiver))
            {
                // DB LOGIC FOR NOTIFICATION
                Guid targetID = db.Accounts.Where(a => a.Username == receiver).Select(a => a.ID).First();
                var targetRecord = db.AccountIMs.Where(a => a.AccountID == targetID).First();
                if (targetRecord != null)
                {
                    int total = targetRecord.TotalIMs += 1;
                    int unread = targetRecord.UnreadIMs += 1;

                    targetRecord.TotalIMs = total;
                    targetRecord.UnreadIMs = unread;

                    db.SaveChanges();
                }
                else
                {
                    var acctIMData = new AccountIM
                    {
                        ID = Guid.NewGuid(),
                        TotalIMs = 1,
                        UnreadIMs = 1,
                        CreateDate = DateTime.Now
                    };

                    db.AccountIMs.Add(acctIMData);
                    db.SaveChanges();
                }

                Clients.Client(connectionId).NewIM(sender, message);
            }
        }

        // EXAMPLE CONNECTION MAPPING -- RELIES ON = ConnectionMapping.cs
        // NEED TO CHANGE USERNAME ON LOGIN
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        public override Task OnConnected()
        {
            DateTime dt = DateTime.Now;
            string time = dt.ToString("HH:mm:ss");
            string defaultName = "Visitor [" + time + "]";
            string name;

            if (HttpContext.Current.Session != null) name = HttpContext.Current.Session["Username"].ToString();
            else name = defaultName;

            _connections.Add(name, Context.ConnectionId);
            Clients.All.Online(name, _connections.Count, _connections.GetAll());

            return base.OnConnected();            
        }

        // NOT WORKING PROPERLY
        public override Task OnDisconnected(bool stopCalled)
        {
            DateTime dt = DateTime.Now;
            string time = dt.ToString("HH:mm:ss");
            string defaultName = "Visitor [" + time + "]";
            string name;

            if (HttpContext.Current.Session != null)
            {
                name = HttpContext.Current.Session["Username"].ToString();
                Guid acctID = (Guid)HttpContext.Current.Session["UserID"];
                var record = db.AccountStatus1.Where(a => a.AccountID == acctID).First();
                record.Active = false;

                if (record.Tell == true)
                {
                    var gameRecord = db.Campaigns.Where(a => a.ID == record.CampaignID).Single();
                    gameRecord.TellActive = false;
                    db.SaveChanges();
                }
                else if (record.Admin == true)
                {
                    var gameRecord = db.Campaigns.Where(a => a.ID == record.CampaignID).Single();
                    gameRecord.Locked = false;
                    db.SaveChanges();
                }

                HttpContext.Current.Session.Clear();
                HttpContext.Current.Session.Abandon();

                db.AccountStatus1.Remove(record);
                db.SaveChanges();
            }
            else name = defaultName;

            _connections.Remove(name, Context.ConnectionId);
            Clients.All.Offline(name);

            return base.OnDisconnected(stopCalled);
        }

        // RETURN TO THIS 
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