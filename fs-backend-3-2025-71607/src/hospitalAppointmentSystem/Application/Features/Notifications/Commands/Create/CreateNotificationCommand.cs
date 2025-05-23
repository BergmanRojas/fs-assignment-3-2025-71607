using Application.Features.Notifications.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using MediatR;

namespace Application.Features.Notifications.Commands.Create;

public class CreateNotificationCommand : IRequest<CreatedNotificationResponse>,  ILoggableRequest, ITransactionalRequest
{
    public required int AppointmentID { get; set; }
    public required string Message { get; set; }
    public required bool EmailStatus { get; set; }
    public required bool SmsStatus { get; set; }


    public bool BypassCache { get; }
    public string? CacheKey { get; }
    public string[]? CacheGroupKey => ["GetNotifications"];

    public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, CreatedNotificationResponse>
    {
        private readonly IMapper _mapper;
        private readonly INotificationRepository _notificationRepository;
        private readonly NotificationBusinessRules _notificationBusinessRules;

        public CreateNotificationCommandHandler(IMapper mapper, INotificationRepository notificationRepository,
                                         NotificationBusinessRules notificationBusinessRules)
        {
            _mapper = mapper;
            _notificationRepository = notificationRepository;
            _notificationBusinessRules = notificationBusinessRules;
        }

        public async Task<CreatedNotificationResponse> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
        {
            Notification notification = _mapper.Map<Notification>(request);

            await _notificationRepository.AddAsync(notification);

            CreatedNotificationResponse response = _mapper.Map<CreatedNotificationResponse>(notification);
            return response;
        }
    }
}
