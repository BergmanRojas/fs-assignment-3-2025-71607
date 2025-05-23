using Application.Features.Users.Rules;
using Application.Services.Encryptions;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Users.Queries.GetById;

public class GetByIdUserQuery : IRequest<GetByIdUserResponse>
{
    public Guid Id { get; set; }

    public class GetByIdUserQueryHandler : IRequestHandler<GetByIdUserQuery, GetByIdUserResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly UserBusinessRules _userBusinessRules;

        public GetByIdUserQueryHandler(
            IUserRepository userRepository,
            IMapper mapper,
            UserBusinessRules userBusinessRules)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _userBusinessRules = userBusinessRules;
        }

        public async Task<GetByIdUserResponse> Handle(GetByIdUserQuery request, CancellationToken cancellationToken)
        {
            User? user = await _userRepository.GetAsync(
                predicate: b => b.Id.Equals(request.Id),
                enableTracking: false,
                cancellationToken: cancellationToken
            );

            await _userBusinessRules.UserShouldBeExistsWhenSelected(user);

            // Decrypting encrypted user data before sending response
            user.FirstName = CryptoHelper.Decrypt(user.FirstName);
            user.LastName = CryptoHelper.Decrypt(user.LastName);
            user.NationalIdentity = CryptoHelper.Decrypt(user.NationalIdentity);
            user.Phone = CryptoHelper.Decrypt(user.Phone);
            user.Address = CryptoHelper.Decrypt(user.Address);
            user.Email = CryptoHelper.Decrypt(user.Email);

            GetByIdUserResponse response = _mapper.Map<GetByIdUserResponse>(user);
            return response;
        }
    }
}
