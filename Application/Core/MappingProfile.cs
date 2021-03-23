using System.Linq;
using Application.Activities;
using Application.Comments;
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

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o
                    => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o
                    => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o
                    => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o
                    => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            //"UserName" in 'AppUser' maps to "Username" in 'Profiles.Profile'
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o
                    => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username, o
                    => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o
                    => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o
                    => o.MapFrom(s => s.Author.Photos
                        .FirstOrDefault(p => p.IsMain).Url));
        }
    }
}