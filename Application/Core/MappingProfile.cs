using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, Activity>();


            CreateMap<Activity, ActivityDto>()
                .ForMember(destination => destination.HostUsername,
                    options
                        => options.MapFrom(source => source
                            .Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, o
                    => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o
                    => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o
                    => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}