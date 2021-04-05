using System;
using System.Text.Json.Serialization;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        //JsonIgnore : don't return this to client 
        [JsonIgnore]
        public string HostUsername { get; set; }

    }
}