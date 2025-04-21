namespace Domain.Entities;

public class Doctor : User
{
    public Doctor() { }

    public Doctor(Guid id, string title, string schoolName)
    {
        Id = id;
        Title = title;
        SchoolName = schoolName;
    }

    public string Title { get; set; }
    public string SchoolName { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new HashSet<Appointment>();
}
