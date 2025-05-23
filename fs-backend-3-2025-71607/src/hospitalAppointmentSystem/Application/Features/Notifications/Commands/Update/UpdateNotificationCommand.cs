using Application.Features.Notifications.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using MediatR;

namespace Application.Features.Notifications.Commands.Update;

public class UpdateNotificationCommand : IRequest<UpdatedNotificationResponse>,  ILoggableRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public required int AppointmentID { get; set; }
    public required string Message { get; set; }
    public required bool EmailStatus { get; set; }
    public required bool SmsStatus { get; set; }


    public bool BypassCache { get; }
    public string? CacheKey { get; }
    public string[]? CacheGroupKey => ["GetNotifications"];

    public class UpdateNotificationCommandHandler : IRequestHandler<UpdateNotificationCommand, UpdatedNotificationResponse>
    {
        private readonly IMapper _mapper;
        private readonly INotificationRepository _notificationRepository;
        private readonly NotificationBusinessRules _notificationBusinessRules;

        public UpdateNotificationCommandHandler(IMapper mapper, INotificationRepository notificationRepository,
                                         NotificationBusinessRules notificationBusinessRules)
        {
            _mapper = mapper;
            _notificationRepository = notificationRepository;
            _notificationBusinessRules = notificationBusinessRules;
        }

        public async Task<UpdatedNotificationResponse> Handle(UpdateNotificationCommand request, CancellationToken cancellationToken)
        {
            Notification? notification = await _notificationRepository.GetAsync(predicate: n => n.Id == request.Id, cancellationToken: cancellationToken);
            await _notificationBusinessRules.NotificationShouldExistWhenSelected(notification);
            notification = _mapper.Map(request, notification);

            await _notificationRepository.UpdateAsync(notification!);

            UpdatedNotificationResponse response = _mapper.Map<UpdatedNotificationResponse>(notification);
            return response;
        }
    }
}
