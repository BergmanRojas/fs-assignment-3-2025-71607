using Quartz;
using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;
using NArchitecture.Core.Persistence.Paging;
using Microsoft.EntityFrameworkCore;
using NArchitecture.Core.Application.Requests;
using Application.Features.Appointments.Queries.GetList;
using Application.Services.Encryptions;

public class ReminderAppointmentJob : IJob
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IMapper _mapper;

    public ReminderAppointmentJob(IAppointmentRepository appointmentRepository, IMapper mapper)
    {
        _appointmentRepository = appointmentRepository;
        _mapper = mapper;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        await CheckAndSendEmails();
    }

    private async Task CheckAndSendEmails()
    {
        var pageRequest = new PageRequest { PageIndex = 0, PageSize = 100 };

        IPaginate<Appointment> appointments = await _appointmentRepository.GetListAsync(
            predicate: x => x.DeletedDate == null && x.Date == DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
            index: pageRequest.PageIndex,
            size: pageRequest.PageSize,
            orderBy: x => x.OrderByDescending(y => y.Date),
            include: x => x.Include(x => x.Doctor).Include(x => x.Patient)
        );

        foreach (var appointment in appointments.Items)
        {
            await SendReminderEmail(appointment);
        }
    }

    private async Task SendReminderEmail(Appointment appointment)
    {
        var dto = _mapper.Map<GetListAppointmentListItemDto>(appointment);

        dto.DoctorFirstName = CryptoHelper.Decrypt(dto.DoctorFirstName);
        dto.DoctorLastName = CryptoHelper.Decrypt(dto.DoctorLastName);
        dto.PatientFirstName = CryptoHelper.Decrypt(dto.PatientFirstName);
        dto.PatientLastName = CryptoHelper.Decrypt(dto.PatientLastName);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Hospital Appointment System", "your_email@gmail.com"));
        message.To.Add(new MailboxAddress($"{dto.PatientFirstName} {dto.PatientLastName}", "patient_email@example.com"));
        message.Subject = "Appointment Reminder";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <html>
                    <body style='font-family: Arial, sans-serif;'>
                        <div style='border: 1px solid #ccc; padding: 10px;'>
                            <p>Dear {dto.PatientFirstName} {dto.PatientLastName},</p>
                            <p>You have an appointment scheduled for <strong>{dto.Date}</strong> at <strong>{dto.Time}</strong>.</p>
                            <p>If you cannot attend, please remember to cancel your appointment in advance.</p>
                            <p><strong>Doctor:</strong> {dto.DoctorTitle} {dto.DoctorFirstName} {dto.DoctorLastName}</p>
                        </div>
                    </body>
                </html>"
        };

        message.Body = bodyBuilder.ToMessageBody();

        try
        {
            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("your_email@gmail.com", "your_email_app_password");
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email send error: {ex.Message}");
        }
    }
}
