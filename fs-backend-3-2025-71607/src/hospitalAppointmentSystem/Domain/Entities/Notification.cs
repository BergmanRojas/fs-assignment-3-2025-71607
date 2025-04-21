using NArchitecture.Core.Persistence.Repositories;
using System;
using System.Collections.Generic;

namespace Domain.Entities;

public class Notification : Entity<int>
{
    public Notification() { }

    public Notification(int id, int appointmentID, string message, bool emailStatus)
    {
        Id = id;
        AppointmentID = appointmentID;
        Message = message;
        EmailStatus = emailStatus;
    }

    public int AppointmentID { get; set; }
    public string Message { get; set; }
    public bool EmailStatus { get; set; }

    public virtual Appointment? Appointment { get; set; }
}
