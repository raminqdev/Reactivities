using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<IList<UserActivityDto>>>
        {
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<IList<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<IList<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var result = new List<UserActivityDto>();

                switch (request.Predicate)
                {
                    case "past":
                        result = await _context.Activities
                            .Where(a => a.Date < DateTime.UtcNow)
                            .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                            .ToListAsync();
                        break;
                }

            }
        }
    }
}